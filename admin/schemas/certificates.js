export default {
  name: 'certificates',
  title: 'Certificates',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'description',
      title: 'Description',
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
      name: 'date',
      title: 'Date',
      type: 'string',
    },
    {
      name: 'link',
      title: 'Link',
      type: 'string',
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
}
