import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

import home from './home'
import projects from './projects'
import experience from './experience'
import education from './education'
import skills from './skills'
import coding from './coding'
import certificates from './certificates'
import achievements from './achievements'
import eca from './eca'
import testimonials from './testimonials'
import blockContent from './blockContent'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    home,
    projects,
    experience,
    education,
    skills,
    coding,
    certificates,
    achievements,
    eca,
    testimonials,
    blockContent,
  ]),
})
