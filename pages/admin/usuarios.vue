<template>
  <v-layout justify-center>
    <v-flex md8>
      <v-layout column justify-space-between mt-3 mx-3>
        <v-layout align-center>
          <v-toolbar-title class="mr-2">Administrar Usuarios</v-toolbar-title>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon small @click="createModal()" v-on="on">
                <v-icon large>mdi-plus-circle</v-icon>
              </v-btn>
            </template>
            <span>Crear Nuevo</span>
          </v-tooltip>
        </v-layout>
        <v-layout>
          <v-flex mx-1 lg12>
            <v-layout align-left justify-left>
              <v-text-field
                v-model.lazy="search"
                single-line
                append-icon="mdi-magnify"
                label="Buscar"
                @click:append="loadData()"
                @keyup.enter="loadData()"
              />
            </v-layout>
          </v-flex>
        </v-layout>

        <v-flex xs12 lg10 xl10 pb-3>
          <v-layout child-flex wrap justify-center align-center>
            <v-card>
              <v-data-table
                item-key="_id"
                sort-by="display_name"
                :items="dataset"
                :headers="headers"
                :loading="loading"
                :server-items-length="pagination.totalItems"
                :options.sync="pagination"
                :footer-props="{
                  itemsPerPageOptions: [{ value: -1 }],
                }"
              >
                <template v-slot:item.roles="{ item }">
                  <span v-text="TipoUsuario[item.roles]" />
                </template>
                <template v-slot:item.display_name="{ item }">
                  {{ item | showDysplatName }}
                </template>
                <!--
                <template v-slot:item.estado="{ item }">
                  <span
                    v-text="
                      item.email_verified ? 'Habilitado' : 'No habilitado'
                    "
                  />
                </template>
                -->
                <template v-slot:item.action="props">
                  <td
                    class="align-center justify-center layout row px-0 transparent"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          text
                          small
                          v-on="on"
                          @click="passwordModal(props.item)"
                        >
                          <v-icon>mdi-account-key</v-icon>
                        </v-btn>
                      </template>
                      <span>Cambiar Contraseña</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          small
                          text
                          v-on="on"
                          @click="editModal(props.item)"
                        >
                          <v-icon>mdi-account-edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          small
                          text
                          v-on="on"
                          @click="deleteModal(props.item)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Eliminar</span>
                    </v-tooltip>
                  </td>
                </template>
              </v-data-table>
            </v-card>
          </v-layout>
        </v-flex>
      </v-layout>
      <!-- Delete -->
      <v-dialog v-model="modalDelete" max-width="400">
        <v-card>
          <v-card-title class="headline mb-0">Eliminar Usuario</v-card-title>
          <v-card-text class="pt-0">
            <p class="mt-0 mb-2">
              ¿Confirmar la eliminación de
              <strong
                v-text="selectedUser.apellido + ' ' + selectedUser.nombre"
              ></strong>
              ?
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text :disabled="loading" @click="modalDelete = false">
              Cancelar
            </v-btn>
            <v-btn
              class="white--text"
              color="red"
              :disabled="loading"
              @click="confirmDeleteUser"
            >
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Change Password -->
      <v-dialog v-model="modalPassword" max-width="450" @input="cancel">
        <v-card>
          <v-card-text class="pa-0">
            <ChangePassword
              :success.sync="success"
              :error="error"
              :user="selectedUser"
              :loading="loading"
              is-abm
              @submit="submitChangePassword"
              @cancel="cancel"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Edit & Alta -->
      <v-dialog v-model="modalEdit" max-width="450" @input="cancel">
        <v-card>
          <v-card-title
            class="headline mb-0"
            v-text="selectedUser._id ? 'Editar Usuario' : 'Crear Usuario'"
          />
          <v-card-text class="pa-0">
            <UsuarioForm
              :success.sync="success"
              :error="error"
              :user="selectedUser"
              @cancel="cancel"
              @submit="submitCreateOrEdit"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState } from 'vuex'
import { Usuarios } from '~/api'
import UsuarioForm from '~/components/UsuarioForm'
import ChangePassword from '~/components/ChangePassword'

import TipoUsuarioLabel from '~/utils/enum/TipoUsuarioLabel'
import capitalizeWords from '~/utils/capitalizeWords'
import loadTableData from '~/mixins/loadTableData'

export default {
  components: { ChangePassword, UsuarioForm },
  middleware: ['authenticated', 'auth_admin'],
  layout: 'admin',

  filters: {
    showDysplatName(item) {
      return capitalizeWords(item.apellido + ' ' + item.nombre)
    },
  },
  mixins: [loadTableData],
  data: () => ({
    headers: [
      { text: 'Nombre', value: 'display_name' },
      { text: 'Email', value: 'email' },
      { text: 'Rol', value: 'roles' },
      { text: 'Estado', value: 'estado' },
      { text: 'Acciones', value: 'action', width: 100, sortable: false },
    ],
    loading: false,
    // -----

    search: '',
    error: '',
    success: false,
    modalDelete: false,
    modalEdit: false,
    modalPassword: false,
    selectedUser: {},
  }),

  computed: {
    ...mapState(['user']),
    TipoUsuario: () => TipoUsuarioLabel,
  },

  mounted() {
    this.loadData()
  },

  methods: {
    cancel() {
      this.modalEdit = false
      this.modalPassword = false
      this.selectedUser = {}
    },

    loadData(nextPage = 0) {
      this.loadTableData(Usuarios.get, nextPage, {
        $or: [
          { nombre: { $regex: this.search, $options: 'i' } },
          { apellido: { $regex: this.search, $options: 'i' } },
          { email: { $regex: this.search, $options: 'i' } },
        ],
      })
    },

    passwordModal(user) {
      this.error = ''
      this.selectedUser = user
      if (this.user._id === user._id) {
        this.$router.open({ name: 'change-password' })
      } else {
        this.modalPassword = true
      }
    },

    editModal(user) {
      this.error = ''
      this.selectedUser = user
      this.modalEdit = true
    },

    createModal() {
      this.error = ''
      this.selectedUser = {}
      this.modalEdit = true
    },

    deleteModal(user) {
      this.selectedUser = user
      this.modalDelete = true
    },

    async confirmDeleteUser() {
      const { error } = await Usuarios.delete(this.selectedUser)
      if (error) {
        this.error = error
      } else {
        this.$notify({ color: 'success', text: 'Usuario Eliminado' })
      }
      this.modalDelete = false
      this.loadData()
    },

    async submitChangePassword({ newPassword }) {
      this.error = ''
      const { error } = await Usuarios.save({
        _id: this.selectedUser._id,
        password: newPassword,
      })
      if (error) {
        this.error = error
      } else {
        this.success = true
        this.$notify({ color: 'success', text: 'Contraseña Cambiada' })
        this.modalPassword = false
      }
    },

    async submitCreateOrEdit(user) {
      this.error = ''
      const { error } = await Usuarios.save(user)
      if (error) {
        this.error = error
      } else {
        this.success = true
        this.$notify({
          color: 'success',
          text: user._id ? 'Usuario Actualizado' : 'Usuario Creado',
        })
        this.modalEdit = false
        this.loadData()
      }
    },
  },
}
</script>
