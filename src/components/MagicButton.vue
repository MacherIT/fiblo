<template lang="pug">
  .magic-button
    .loading(v-if="sent")
      font-awesome-icon(icon="circle-notch", spin)
    button(@click="exec") Cargar todo todito!
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

import fiblo from '@/services/fiblo';

export default {
  data() {
    return {
      beneficiary_address: '',
      sent: false,
    };
  },
  computed: {
    ...mapState('usuarios', ['token']),
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: `/api/usuarios/1`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).then(
      ({ data }) => {
        this.beneficiary_address = data.address;
      },
      error => {
        console.error(error);
      },
    );
  },
  methods: {
    exec() {
      const proyecto = {
        ciudad: {
          provincia: { id: 6, nombre: 'Buenos Aires' },
          ciudad: { id: '429', nombre: 'Abasto' },
        },
        categoria_id: 1,
        nombre: `magicproject${parseInt(Math.random() * 100)}`,
        domicilio: 'magichouse',
        telefono: 123456789,
        email: 'csa@csa.csa',
        monto: 20000,
        montoSuperaMax: 30000,
        cantAcciones: 200,
        sector: '',
        emprendedores: [{ nombre: 'csa' }],
      };

      fiblo.deployProyectoFull(
        proyecto,
        this.beneficiary_address,
        proyecto.cantAcciones,
        'magic', // Symbol
        20000, // Monto
        30000, // Monto max
        moment(new Date())
          .add(30, 'days')
          .format('YYYY/MM/DD'),
        (error, instance) => {
          if (error) {
            console.error(error);
          } else if (instance.address) {
            proyecto.address = instance.address;
            this.$http({
              method: 'POST',
              url: '/api/proyectos',
              body: proyecto,
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }).then(
              ({ status }) => {
                this.sent = false;
                fiblo.addBeneficiary(this.beneficiary_address, (error, resp) => {
                  if (error) {
                    console.error(error);
                  } else {
                    fiblo.addProject(proyecto.address, (error, resp) => {
                      if (error) {
                        console.error(error);
                      } else {
                        fiblo.setProjectValidity(proyecto.address, (error, res) => {
                          if (error) {
                            console.error(error);
                          } else {
                            fiblo.setBeneficiaryValidity(proyecto.address, (error, res) => {
                              if (error) {
                                console.error(error);
                              } else {
                                // for (let i = 0; i < 2; i++) {
                                fiblo.receiveFunds(
                                  proyecto.address,
                                  2, // User id
                                  1, // Amount in ETH
                                  (error, tx) => {
                                    if (error) {
                                      console.error(error);
                                    } else {
                                      console.log(tx);
                                      this.sent = false;
                                    }
                                  },
                                );
                                // }
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              },
              error => {
                this.sent = false;
                console.error(error);
              },
            );
          }
        },
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.magic-button {
  position: fixed;
  left: 20px;
  top: 20px;
}
</style>
