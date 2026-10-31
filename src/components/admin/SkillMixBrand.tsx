import React from 'react'

export const SkillMixLogo = () => (
  <div className="skill-mix-brand" aria-label="Skill & Mix CMS">
    <span className="skill-mix-brand__name">
      <span>skill</span>
      <span className="skill-mix-brand__amp">&amp;</span>
      <span>mix</span>
      <span className="skill-mix-brand__star">*</span>
    </span>
    <span className="skill-mix-brand__product">content management</span>
  </div>
)

/** The browser icon from Site settings → Brand (served by src/app/(icons)), so it matches the tab and website. */
export const SkillMixIcon = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className="skill-mix-icon" src="/icons/icon-96.png" alt="Skill & Mix CMS" width={25} height={25} />
)
