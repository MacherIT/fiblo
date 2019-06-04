<template lang="pug">
  .etapa-final
    TourProyectoNew(v-if="tour.firstRun && tour.main && !tour.proyectoNew && $route.path === '/proyectos/new' && !sent && correcto")
    .creando-proyecto(v-if="sent")
      span Creando proyecto
      font-awesome-icon(icon="circle-notch", spin)
    .resultado(v-if="correcto")
      span El proyecto fue creado exitosamente.
      router-link(:to="'/proyectos/' + new_project_id") Ver proyecto
    .resultado.error(v-if="error")
      span La creación del proyecto falló, intentelo nuevamente más tarde.
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { Validator } from "vee-validate";
import moment from "moment";

import TourProyectoNew from "@/components/General/Tour/ProyectoNew";

import fiblo from "@/services/fiblo";
import marketcap from "@/services/marketcap";

const CANT_MAX_DIAS_RONDA = 90;

export default {
  props: ["proyecto", "set", "setEtapaActiva"],
  components: {
    TourProyectoNew
  },
  data() {
    return {
      sent: true,
      error: false,
      correcto: false,
      new_project_id: ""
    };
  },
  computed: {
    ...mapState("tour", ["tour"]),
    ...mapState("usuarios", ["token"]),
    ...mapGetters("usuarios", ["usuario"])
  },
  mounted() {
    const v = new Validator();
    v.verify(this.proyecto.email, "required|email").then(({ valid, error }) => {
      if (error) {
        console.error(error);
        this.setFlash({
          tipo: "error",
          mensaje: "El email ingresado es inválido."
        });
        this.sent = false;
        this.error = true;
      } else {
        if (
          // this.proyecto.beneficiary_address &&
          this.proyecto.nombre &&
          this.proyecto.categoria_id &&
          this.proyecto.ciudad &&
          this.proyecto.ciudad.ciudad &&
          this.proyecto.ciudad.provincia &&
          this.proyecto.domicilio &&
          valid &&
          this.proyecto.fechaFin &&
          moment(new Date(this.proyecto.fechaFin)).isBetween(
            moment(new Date()).subtract(2, "days"),
            // moment(new Date()).subtract(1, 'days'),
            moment(new Date()).add(CANT_MAX_DIAS_RONDA, "days")
          ) &&
          this.proyecto.descripcion &&
          this.stripHtml(this.proyecto.descripcion) !== "" &&
          this.proyecto.propuesta &&
          this.stripHtml(this.proyecto.propuesta) !== "" &&
          this.proyecto.emprendedores &&
          this.proyecto.emprendedores.length > 0 &&
          this.proyecto.monto &&
          parseFloat(this.proyecto.monto) > 0 &&
          this.proyecto.montoSuperaMax &&
          parseFloat(this.proyecto.montoSuperaMax) > 0 &&
          this.proyecto.cantAcciones &&
          parseFloat(this.proyecto.cantAcciones) > 0
        ) {
          const proms = [];

          const isImagen = imagen =>
            imagen &&
            typeof imagen === "object" &&
            imagen.type &&
            new RegExp("image/*").test(imagen.type);

          const subirImagen = imagen => {
            const formData = new FormData();
            formData.append("imagenes", imagen);
            return this.$http({
              method: "POST",
              url: "/api/upload",
              body: formData,
              headers: {
                Authorization: `Bearer ${this.token}`
              }
            });
          };

          if (isImagen(this.proyecto.logo)) {
            proms.push(
              subirImagen(this.proyecto.logo).then(
                ({ data }) => {
                  this.proyecto.logo = data[0].uri;
                },
                error => {
                  console.error(error);
                }
              )
            );
          }

          this.proyecto.emprendedores.map(emp => {
            if (isImagen(emp.avatar)) {
              proms.push(
                subirImagen(emp.avatar).then(
                  ({ data }) => {
                    emp.avatar = data[0].uri;
                  },
                  error => {
                    console.error(error);
                  }
                )
              );
            }
          });

          Promise.all(proms).then(
            () => {
              fiblo.deployProyectoFull(
                // this.proyecto.beneficiary_address,
                this.proyecto.cantAcciones,
                this.proyecto.nombre
                  .toLowerCase()
                  .replace(/\s/g, "-")
                  .replace(/á/g, "a")
                  .replace(/é/g, "e")
                  .replace(/í/g, "i")
                  .replace(/ó/g, "o")
                  .replace(/ú/g, "u")
                  .replace(/ñ/g, "n")
                  .replace(/[^a-zA-Z0-9\.-_]/g, "")
                  .substr(0, 5)
                  .toUpperCase(),
                parseInt(parseFloat(this.proyecto.monto) * 100), // Monto en centavos
                parseInt(parseFloat(this.proyecto.montoSuperaMax) * 100), // Monto en centavos
                moment(this.proyecto.fechaFin).unix(),
                (error, instance) => {
                  if (error) {
                    console.error(error);
                    this.setFlash({
                      tipo: "error",
                      mensaje: "Ocurrió un error al crear el contrato."
                    });
                    this.error = true;
                    this.sent = false;
                  } else if (instance.address) {
                    this.proyecto.address = instance.address;
                    this.$http({
                      method: "POST",
                      url: "/api/proyectos",
                      body: this.proyecto,
                      headers: {
                        Authorization: `Bearer ${this.token}`
                      }
                    }).then(
                      ({ status, data }) => {
                        this.sent = false;
                        console.log(status);
                        if (status === 201) {
                          this.correcto = true;
                          this.new_project_id = data.id;
                        }
                      },
                      error => {
                        this.sent = false;
                        console.error(error);
                        this.error = true;
                      }
                    );
                  }
                }
              );
            },
            error => {
              this.setFlash({
                tipo: "error",
                mensaje: "Ocurrió un error al guardar las imágenes"
              });
            }
          );
        } else {
          console.log("error");
          this.sent = false;
        }
      }
    });
  },
  methods: {
    ...mapActions("general", ["setFlash"])
  }
};
</script>

<style lang="scss" scoped>
@import "~Styles/_config.scss";
.etapa-final {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .creando-proyecto {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    span {
      margin-bottom: 20px;
      color: #fff;
      font-family: $fontKeepCalmMedium;
      text-transform: uppercase;
    }
    svg {
      color: #fff;
    }
  }
  .resultado {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    span,
    a {
      color: #fff;
      margin-bottom: 10px;
    }
  }
}
</style>
