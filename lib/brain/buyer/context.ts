export interface BuyerActivityMemory {

  id: string;

  action: string;

  title: string;

  description?: string | null;

  actorType: string;

  createdAt: Date;

}



export interface BuyerContext {

  buyer: {

    companyName: string;

    contactPerson?: string | null;

    country?: string | null;

    phone?: string | null;

    email?: string | null;

  };


  requirement: {

    product?: string | null;

    quantity?: string | null;

    unit?: string | null;

    message?: string | null;

  };


  engagement: {

    totalFollowUps: number;

    completedFollowUps: number;

    pendingFollowUps: number;


    firstContactAt?: Date | null;

    lastActivityAt?: Date | null;

  };


  history: {

    notes: string[];

    outcomes: string[];


    activities: BuyerActivityMemory[];

  };

}