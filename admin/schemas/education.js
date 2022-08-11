export default {
  name: 'education',
  title: 'Education',
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
      name: 'organisation',
      title: 'Organisation',
      type: 'string',
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
      name: 'details',
      title: 'Details',
      type: 'text',
    },
    {
      name: 'grade',
      title: 'Grade',
      type: 'string',
    },
    {
      name: 'year',
      title: 'Duration',
      type: 'string',
    }
  ],

  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
}
