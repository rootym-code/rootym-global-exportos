export const followUpInclude = {
    inquiry: {
      select: {
        id: true,
        inquiryNumber: true,
        companyName: true,
        contactPerson: true,
        email: true,
        phone: true,
        country: true,
        product: true,
      },
    },
  
    assignedTo: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  
    completedBy: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  } as const;