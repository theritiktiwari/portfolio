export default {
    name: 'home',
    title: 'Home Page',
    type: 'document',
    fields: [
        {
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
        },
        {
            name: 'aboutMainText',
            title: 'About Main-Text',
            type: 'array',
            of: [
                {
                    title: 'Block',
                    type: 'block',
                    styles: [{ title: 'Normal', value: 'normal' }],
                    lists: [],
                },
            ],
        },
        {
            name: 'aboutSubText',
            title: 'About Sub-Text',
            type: 'array',
            of: [
                {
                    title: 'Block',
                    type: 'block',
                    styles: [{ title: 'Normal', value: 'normal' }],
                    lists: [],
                },
            ],
        },
        {
            name: 'resume',
            title: 'Resume',
            type: 'file',
        },
        {
            name: 'linkedin',
            title: 'LinkedIn Followers',
            type: 'string',
        },
        {
            name: 'github',
            title: 'GitHub Followers',
            type: 'string',
        },
        {
            name: 'instagram',
            title: 'Instagram Followers',
            type: 'string',
        },
        {
            name: 'youtube',
            title: 'YouTube Subscribers',
            type: 'string',
        },
    ],
    preview: {
        select: {
            title: 'tagline',
        },
    },
}
