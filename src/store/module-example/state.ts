export interface ExampleStateInterface {
  student: StudentInterface | null;
}

export interface StudentInterface {
  id?: string;
  name: string;
  lastName: string;
  dpi: string;
  birthdate: string;
  genre: string;
  password: string;
}

function state(): ExampleStateInterface {
  return {
    student: null,
  };
}

export default state;
