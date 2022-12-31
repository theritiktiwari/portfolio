export default {
    name: 'skills',
    title: 'Skills',
    type: 'document',
    fields: [
        {
            name: 'domain',
            title: 'Domain',
            type: 'string',
        },
        {
            name: 'skill',
            title: 'Skill',
            type: 'string',
        },
        {
            name: "image",
            title: "Image",
            type: "image",
        }
    ],
    preview: {
        select: {
            title: 'skill',
            media: 'image'
        },
    },
}
