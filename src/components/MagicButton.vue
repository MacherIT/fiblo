<template lang="pug">
  .magic-button
    .loading(v-if="sent")
      font-awesome-icon(icon="circle-notch", spin)
    button(@click="exec") Crear proyecto de prueba
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
        fechaFin: moment(new Date()).subtract(1, 'days'),
        // fechaFin: moment(new Date()).add(30, 'days'),
      };

      fiblo.deployProyectoFull(
        this.beneficiary_address,
        proyecto.cantAcciones,
        'magic', // Symbol
        20000 * 100, // Monto * 100 centavos
        30000 * 100, // Monto max * 100 centavos
        moment(new Date())
          .subtract(1, 'days')
          // .add(30, 'days')
          .unix(),
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
                                // fiblo.receiveFunds(
                                //   proyecto.address,
                                //   2, // User id
                                //   2, // Amount in ETH
                                //   (error, tx) => {
                                //     if (error) {
                                //       console.error(error);
                                //     } else {
                                //       console.log(tx);
                                //       this.sent = false;
                                //     }
                                //   },
                                // );
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
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $colorPaletaC7;
    color: #fff;
    border: 0;
    @include sombra(0 0 4px 0 #000);
    border-radius: 6px;
    font-family: $fontKeepCalmMedium;
    text-transform: uppercase;
    height: 35px;
    padding: 0 15px;
    cursor: pointer;
    font-size: 70%;
    @include ease-transition(70ms);
    &:hover {
      background-color: $colorPaletaC6;
    }
  }
}
</style>
