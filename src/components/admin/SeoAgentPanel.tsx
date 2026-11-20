import type { ServerProps } from 'payload'

import { readFile, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import React from 'react'

import { isSuperAdmin } from '@/access'

/**
 * "SEO agent" panel at the top of the admin dashboard (super admins only).
 *
 * The nightly SEO agent (sm-fe/seo-agent) keeps its notes as Markdown files on the server,
 * in ~/.seo-agent/state. The CMS runs on the same server as the same user, so this reads them
 * straight from disk and shows them readably. Set SEO_AGENT_STATE_DIR to use another folder.
 * When the folder does not exist (local development, another server), nothing is shown.
 */

const stateDir = () => process.env.SEO_AGENT_STATE_DIR || path.join(os.homedir(), '.seo-agent', 'state')

async function read(name: string) {
  const file = path.join(stateDir(), name)
  try {
    const [text, info] = await Promise.all([readFile(file, 'utf8'), stat(file)])
    return { text, updatedAt: info.mtime }
  } catch {
    return null
  }
}

/** Top-level "- " bullets, with indented continuation lines joined on. */
function bullets(markdown: string): string[] {
  const items: string[] = []
  for (const line of markdown.split(/\r?\n/)) {
    const bullet = line.match(/^[-*]\s+(.*)$/)
    if (bullet) items.push(bullet[1].trim())
    else if (items.length && /^\s+\S/.test(line)) items[items.length - 1] += ` ${line.trim()}`
  }
  return items.filter(Boolean)
}

/** Lines the owner still has to answer in facts.md: "- TODO Học phí each course:" → "Học phí each course". */
const openFacts = (markdown: string) =>
  bullets(markdown)
    .filter((item) => /^TODO\b/.test(item))
    .map((item) => item.replace(/^TODO\s*/, '').replace(/:\s*$/, ''))

/** The newest journal entry: everything after the last heading, else the last lines. */
function latestEntry(markdown: string) {
  const lines = markdown.trimEnd().split(/\r?\n/)
  let start = -1
  lines.forEach((line, index) => {
    if (/^#{1,3}\s/.test(line)) start = index
  })
  const entry = start === -1 ? lines.slice(-12) : lines.slice(start)
  const title = start === -1 ? null : entry[0].replace(/^#+\s*/, '')
  const body = (start === -1 ? entry : entry.slice(1)).join('\n').trim()
  return { title, body }
}

/** `code` spans and **bold** from the agent's Markdown; everything else stays plain text. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 1 ? (
          <code key={index}>{part.slice(1, -1)}</code>
        ) : part.startsWith('**') && part.endsWith('**') && part.length > 3 ? (
          <strong key={index}>{part.slice(2, -2)}</strong>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  )
}

const formatDate = (date: Date) =>
  date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'medium', timeStyle: 'short' })

export async function SeoAgentPanel({ user }: ServerProps) {
  if (!isSuperAdmin(user)) return null

  const [todo, facts, journal, alert] = await Promise.all([
    read('owner-todo.md'),
    read('facts.md'),
    read('journal.md'),
    read('ALERT.md'),
  ])
  if (!todo && !facts && !journal && !alert) return null

  const todos = todo ? bullets(todo.text) : []
  const missingFacts = facts ? openFacts(facts.text) : []
  const entry = journal?.text.trim() ? latestEntry(journal.text) : null
  const alertText = alert?.text.trim()

  return (
    <section className="seo-agent-panel" aria-labelledby="seo-agent-panel-title">
      <header className="seo-agent-panel__head">
        <h2 id="seo-agent-panel-title">SEO agent</h2>
        <p>
          What the nightly SEO agent needs from you. Only super admins see this. Source:{' '}
          <code>{stateDir()}</code>
        </p>
      </header>

      {alertText ? (
        <div className="seo-agent-panel__alert" role="alert">
          <h3>Failed deploy</h3>
          <pre>{alertText}</pre>
        </div>
      ) : null}

      <div className="seo-agent-panel__grid">
        <div className="seo-agent-panel__card">
          <h3>
            To do <span className="seo-agent-panel__count">{todos.length}</span>
          </h3>
          {todo ? <p className="seo-agent-panel__meta">Updated {formatDate(todo.updatedAt)}</p> : null}
          {todos.length ? (
            <ol className="seo-agent-panel__list">
              {todos.map((item, index) => (
                <li key={index}>
                  <Inline text={item} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="seo-agent-panel__empty">Nothing to do right now.</p>
          )}
        </div>

        <div className="seo-agent-panel__card">
          <h3>
            Facts to fill in <span className="seo-agent-panel__count">{missingFacts.length}</span>
          </h3>
          <p className="seo-agent-panel__meta">
            The agent only writes facts it can confirm. Answer these in{' '}
            <code>{path.join(stateDir(), 'facts.md')}</code> and remove the word TODO from each line you fill in.
          </p>
          {missingFacts.length ? (
            <ul className="seo-agent-panel__list">
              {missingFacts.map((item, index) => (
                <li key={index}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="seo-agent-panel__empty">All facts are filled in.</p>
          )}
        </div>
      </div>

      {entry ? (
        <details className="seo-agent-panel__journal">
          <summary>
            Last run{entry.title ? `: ${entry.title}` : ''}
            {journal ? <span className="seo-agent-panel__meta"> · updated {formatDate(journal.updatedAt)}</span> : null}
          </summary>
          <pre>{entry.body}</pre>
        </details>
      ) : null}
    </section>
  )
}
