import { MutationTree } from 'vuex';
import { ExampleStateInterface, StudentInterface } from './state';

const mutation: MutationTree<ExampleStateInterface> = {
  setStudent(state, payload: StudentInterface) {
    state.student = payload;
  },
};

export default mutation;
