<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="card col-6" v-if="!isPageLoading && student">
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md row justify-center items-center" ref="qForm">
          <h5 class="text-center col-12">Registrar estudiante</h5>
          <q-input
            v-model="form.name"
            type="text"
            label="Nombres"
            class="col-5"
            lazy-rules
            placeholder="John Doe"
            :rules="[(val) => val.length > 3 || 'Debes escribir los nombres']"
          />
          <q-input
            v-model="form.lastName"
            type="text"
            label="Apellidos"
            class="col-5"
            lazy-rules
            placeholder="Jhonson Doe"
            :rules="[(val) => val.length > 3 || 'Debes escribir los apellidos']"
          />
          <q-input
            v-model="form.birthdate"
            type="text"
            label="Fecha de nacimiento"
            mask="##-##-####"
            class="col-5"
            lazy-rules
            :rules="[(val) => val.length === 10 || 'Debes escribir la fecha de nacimiento']"
            placeholder="dd-mm-yyyy"
          />
          <q-input
            v-model="form.dpi"
            mask="####-#####-####"
            unmasked-value
            label="DPI"
            class="col-5"
            placeholder="####-#####-####"
            lazy-rules
            :rules="[(val) => val.length === 13 || 'Debes escribir el DPI']"
          />
          <q-select
            v-model="form.genre"
            :options="['Masculino', 'Femenino']"
            label="Genero"
            class="col-5"
            lazy-rules
            :rules="[(val) => val.length > 1 || 'Debes escoger un genero']"
          />
          <q-input
            v-model="form.password"
            :type="isPwd ? 'password' : 'text'"
            label="Contraseña"
            class="col-5"
            placeholder="********"
            lazy-rules
            :rules="[
              (val) => val.length > 3 || 'Debes escribir la contraseña',
              (val) => val.length > 8 || 'La contraseña debe tener al menos 8 caracteres',
            ]"
          >
            <template v-slot:append>
              <q-btn flat round color="grey" :icon="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <div class="row justify-end items-center col-10 q-mt-lg">
            <q-btn
              flat
              class="text-capitalize q-mr-sm"
              label="reiniciar"
              type="reset"
              color="negative"
              :loading="isLoading"
            />
            <q-btn
              class="text-capitalize q-mr-sm"
              label="actualizar"
              color="secondary"
              @click="onUpdate"
              :loading="isLoading"
            />
            <q-btn class="text-capitalize" label="registrar" type="submit" color="primary" :loading="isLoading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    <q-spinner-gears color="primary" size="3rem" :thickness="5" v-else />
  </q-page>
</template>

<script lang="ts">
import { QForm, useQuasar } from 'quasar';
import { useStore } from 'src/store';
import { computed, defineComponent, onBeforeMount, ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const store = useStore();
    const student = computed(() => store.state.module.student);
    const form = ref({
      name: '',
      lastName: '',
      dpi: '',
      birthdate: '',
      genre: '',
      password: '',
    });
    const qForm = ref<QForm | null>(null);
    const isPwd = ref(true);
    const isLoading = ref(false);
    const isPageLoading = ref(false);
    const { notify } = useQuasar();

    const onReset = () => {
      form.value = {
        name: '',
        lastName: '',
        dpi: '',
        birthdate: '',
        genre: '',
        password: '',
      };
      if (qForm.value) qForm.value.resetValidation();
    };

    onBeforeMount(async () => {
      isPageLoading.value = true;
      await store.dispatch('module/getStudentById', '-Mvej4hBkzcmRJXLxV4Q');
      if (student.value) form.value = { ...student.value, password: '' };
      setTimeout(() => (isPageLoading.value = false), 500);
    });

    return {
      form,
      qForm,
      isPwd,
      isLoading,
      isPageLoading,
      student,

      async onSubmit() {
        if (qForm.value) {
          isLoading.value = true;
          const res = await qForm.value.validate();
          if (res) {
            const res = (await store.dispatch('module/registerStudent', form.value)) as Promise<{
              status: boolean;
              msg: string;
            }>;

            if ((await res).status) {
              notify({
                message: 'Estudiante registrado con exito',
                type: 'positive',
                position: 'top-right',
              });
              isLoading.value = false;
            } else {
              notify({
                message: (await res).msg,
                type: 'negative',
                position: 'top-right',
              });
              isLoading.value = false;
            }
          }
        }
      },
      onUpdate: async () => {
        isLoading.value = true;
        const res = (await store.dispatch('module/updateStudent', {
          id: '-Mvej4hBkzcmRJXLxV4Q',
          form: form.value,
        })) as Promise<{
          status: boolean;
          msg: string;
        }>;
        if ((await res).status) {
          notify({
            message: 'Estudiante actualizado con exito',
            type: 'positive',
            position: 'top-right',
          });
          isLoading.value = false;
        } else {
          notify({
            message: (await res).msg,
            type: 'negative',
            position: 'top-right',
          });
          isLoading.value = false;
        }
      },
      onReset,
    };
  },
});
</script>
