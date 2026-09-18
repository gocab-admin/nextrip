const DocumentConfig = {
  user: [
    {
      name: 'Driving License',
      indexName: 'drivingLicense',
      description: '',
      storage: 'public/UserDocuments',
      status: true,
      mandatory: true,
      fields: [
        {
          name: 'Front Image',
          indexName: 'frontImage',
          type: 'image',
          value: ''
        },
        {
          name: 'Back Image',
          indexName: 'backImage',
          type: 'image',
          value: ''
        },
        {
          name: 'Expiry Date',
          indexName: 'expDate',
          type: 'date',
          value: ''
        }
      ]
    },
    {
      name: 'Government ID Proof',
      indexName: 'governmentidProof',
      description: '',
      storage: 'public/UserDocuments',
      status: true,
      mandatory: true,
      fields: [
        {
          name: 'Front Image',
          indexName: 'frontImage',
          type: 'image',
          value: ''
        },
        {
          name: 'Back Image',
          indexName: 'backImage',
          type: 'image',
          value: ''
        },
        {
          name: 'Expiry Date',
          indexName: 'expDate',
          type: 'date',
          value: ''
        }
      ]
    },
    {
      name: 'Pan Card',
      indexName: 'pancard',
      description: '',
      storage: 'public/UserDocuments',
      status: true,
      mandatory: true,
      fields: [
        {
          name: 'Front Image',
          indexName: 'frontImage',
          type: 'image',
          value: ''
        },
        {
          name: 'Document Number',
          indexName: 'documentNumber',
          type: 'string',
          value: ''
        },
        {
          name: 'Expiry Date',
          indexName: 'expDate',
          type: 'date',
          value: ''
        }
      ]
    }
  ]
}

export { DocumentConfig }
