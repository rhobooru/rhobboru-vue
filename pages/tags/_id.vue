<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <card-header
            class="display-1"
          >
            <template v-slot:title>
              <span
                v-if="!editingTag"
                v-text="tag.name"
              />
              <v-text-field
                v-else
                v-model="editedName"
                class="headline editable-name"
                label="Tag name"
                placeholder="name..."
                filled
                single-line
                dense
                :counter="255"
              />
            </template>
            <template v-slot:action>
              <v-btn
                v-if="!editingTag"
                text
                @click="editTag"
              >
                <v-icon left>
                  fa-edit
                </v-icon>
                Edit
              </v-btn>

              <v-btn
                v-if="editingTag"
                text
                @click="cancelTag"
              >
                <v-icon left>
                  fa-times
                </v-icon>
                Cancel
              </v-btn>
              <v-btn
                v-if="editingTag"
                text
                @click="saveTag"
              >
                <v-icon left>
                  fa-save
                </v-icon>
                Save
              </v-btn>
            </template>
          </card-header>

          <v-card-text>
            <span
              v-if="!editingTag"
              v-text="tag.summary"
            />
            <v-textarea
              v-else
              v-model="editedSummary"
              label="Summary"
              placeholder="summary..."
              :counter="255"
              clearable
              auto-grow
              rows="1"
              hint="Summaries should be short and sweet"
              persistent-hint
              filled
            />
          </v-card-text>

          <v-card-actions
            v-show="editingTag"
          >
            <v-tooltip
              bottom
              :open-delay="500"
            >
              <template
                v-slot:activator="{ on: tooltip }"
              >
                <v-dialog
                  v-model="hideTagDialog"
                  width="500"
                >
                  <template v-slot:activator="{ on: hideTagDialog }">
                    <v-btn
                      color="warning mx-1"
                      v-on="{...tooltip, ...hideTagDialog}"
                    >
                      <v-icon left>
                        fa-eye-slash
                      </v-icon>
                      Hide Tag
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title
                      class="title warning text-uppercase"
                    >
                      Hide tag
                    </v-card-title>

                    <v-card-text
                      class="pt-3"
                    >
                      <p>
                        Soft-deleting a tag will hide it from users who do not have
                        permission to see soft-deleted tags. This will prevent it from
                        being searched on or from being tagged to records.
                      </p>

                      <p>
                        <strong>
                          When soft-deleted, the tag will lose all of its tagged records.
                          These cannot be restored. Soft-deleted tags retain their
                          metadata, such as descriptions and aliases.
                        </strong>
                      </p>

                      <p>
                        Users with sufficient permissions can restore soft-deleted tags to un-hide them or
                        permanently delete the tag to remove it from the database.
                      </p>

                      <p>
                        This action can be useful if you want to prevent a tag from being used and want to
                        prevent it from being created again in the future. Otherwise, consider <kbd>aliasing</kbd>
                        this tag to another tag to do automatic redirection.
                      </p>
                    </v-card-text>

                    <v-divider />

                    <v-card-actions>
                      <v-btn
                        color="warning"
                        @click="hideTagDialog = false"
                      >
                        <v-icon left>
                          fa-eye-slash
                        </v-icon>
                        Hide
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        text
                        @click="hideTagDialog = false"
                      >
                        <v-icon left>
                          fa-times
                        </v-icon>
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <span>Soft-delete this tag to hide it<br>Click for details</span>
            </v-tooltip>

            <v-tooltip
              bottom
              :open-delay="500"
            >
              <template
                v-slot:activator="{ on: tooltip }"
              >
                <v-dialog
                  v-model="deleteTagDialog"
                  width="500"
                >
                  <template v-slot:activator="{ on: deleteTagDialog }">
                    <v-btn
                      color="error mx-1"
                      v-on="{...tooltip, ...deleteTagDialog}"
                    >
                      <v-icon left>
                        fa-trash
                      </v-icon>
                      Delete Tag
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title
                      class="title error text-uppercase"
                    >
                      Delete tag
                    </v-card-title>

                    <v-card-text
                      class="pt-3"
                    >
                      <p>
                        Deleting this tag will scrub it from the database.
                      </p>

                      <p>
                        <strong>
                          When deleted, the tag will lose all of its data, such as
                          tagged records. These cannot be restored.
                        </strong>
                      </p>
                    </v-card-text>

                    <v-divider />

                    <v-card-actions>
                      <v-btn
                        color="error"
                        @click="deleteTagDialog = false"
                      >
                        <v-icon left>
                          fa-trash
                        </v-icon>
                        Delete Tag
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        text
                        @click="deleteTagDialog = false"
                      >
                        <v-icon left>
                          fa-times
                        </v-icon>
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <span>Delete this tag<br>Click for details</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <card-header
            title="Description"
          >
            <template v-slot:action>
              <v-btn
                v-if="!editingDescription"
                text
                @click="editDescription"
              >
                <v-icon left>
                  fa-edit
                </v-icon>
                Edit
              </v-btn>

              <v-btn
                v-if="editingDescription"
                text
                @click="cancelDescription"
              >
                <v-icon left>
                  fa-times
                </v-icon>
                Cancel
              </v-btn>
              <v-btn
                v-if="editingDescription"
                text
                @click="saveDescription"
              >
                <v-icon left>
                  fa-save
                </v-icon>
                Save
              </v-btn>
            </template>
          </card-header>

          <v-card-text
            v-if="!editingDescription"
            v-html="tag.description"
          />
          <v-card-text
            v-else
          >
            <editor
              :content="tag.description"
              :placeholder="'tag description...'"
              @changed="descriptionChanged"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <card-header
            title="Records"
            :count="tag.records_count"
          >
            <template v-slot:action>
              <v-btn
                text
                nuxt
                exact
                :to="'/records?query=' + tag.name"
              >
                View all
              </v-btn>
            </template>
          </card-header>

          <v-card-text>
            <thumbnail-slider
              :records="records"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="errorSnackbar"
      color="error"
    >
      Something went wrong
      <v-btn
        text
        @click="errorSnackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import ThumbnailSlider from '~/components/Record/ThumbnailSlider'
import Editor from '~/components/Editor'
import CardHeader from '~/components/CardHeader'

export default {
  components: {
    ThumbnailSlider,
    Editor,
    CardHeader,
  },

  data () {
    return {
      record: { content_rating: {}, created_by: {} },
      tag: { aliased_to_tag: {} },

      editingDescription: false,
      editedDescription: '',

      editingTag: false,
      editedName: '',
      editedSummary: '',

      hideTagDialog: false,
      deleteTagDialog: false,

      errorSnackbar: false,
    }
  },

  computed: {
    records () {
      if (!this.tag || !this.tag.records) { return null }

      return this.tag.records.data
    },
  },

  created () {
    this.getTag()
  },

  methods: {

    editTag () {
      this.editingTag = true
    },

    saveTag () {
      const mutation = gql`mutation(
        $id: ID!
        $name: String
        $summary: String
      ){
        updateTag(
          id: $id
          name: $name
          summary: $summary
        ){
          id
          name
          summary
        }
      }`

      const variables = {
        id: this.tag.id,
        name: this.editedName,
        summary: this.editedSummary,
      }

      this.$apollo.mutate({ mutation, variables })
        .then(({ data }) => {
          this.tag.name = data.updateTag.name
          this.tag.summary = data.updateTag.summary
          this.editedName = this.tag.name
          this.editedSummary = this.tag.summary
          this.editingTag = false
        })
        .catch(({ error }) => {
          this.errorSnackbar = true
          console.error(error)
        })
    },

    cancelTag () {
      this.editingTag = false
    },

    descriptionChanged (value) {
      this.editedDescription = value
    },

    editDescription () {
      this.editingDescription = true
    },

    saveDescription () {
      const mutation = gql`mutation($id: ID!, $description: String){
        updateTag(id: $id, description: $description){
          id
          description
        }
      }`

      const variables = {
        id: this.tag.id,
        description: this.editedDescription,
      }

      this.$apollo.mutate({ mutation, variables })
        .then(({ data }) => {
          this.tag.description = data.updateTag.description
          this.editingDescription = false
        })
        .catch(({ error }) => {
          this.errorSnackbar = true
          console.error(error)
        })
    },

    cancelDescription () {
      this.editingDescription = false
    },

    getTag () {
      const isId = !isNaN(this.$route.params.id)

      const query = gql`query($id: ID, $name: String){
        tag(id: $id, name: $name){
          id
          name
          description
          summary
          records_count
          aliased_to{
            id
            name
          }
          records(page: 1, first: 10){
            data{
              id
              thumbnail
              width
              height
            }
          }
        }
      }`

      const variables = { }
      if (isId) { variables.id = this.$route.params.id } else { variables.name = this.$route.params.id }

      this.$apollo.query({ query, variables })
        .then(({ data }) => {
          this.tag = data.tag
          this.editedName = this.tag.name
          this.editedSummary = this.tag.summary
        })
    },
  },
}
</script>

<style scoped>
.editable-name{
  max-width:400px;
}
</style>
