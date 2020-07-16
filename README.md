# Encuestas

> SPA client from Rapicopia

## Tecnologías utilizadas

### Tecnologías básicas

- [NodeJS LTS](https://nodejs.org/) o instalar con [NVM](https://github.com/creationix/nvm)

### Tecnologías del proyecto

- [NuxtJs](https://nuxtjs.org)
- [VueJS](https://vuejs.org): Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces.
- [Vue-router](https://github.com/vuejs/vue-router): vue-router is the official router for Vue.js. It deeply integrates with Vue.js core to make building Single Page Applications with Vue.js a breeze
- [Vuex](https://github.com/vuejs/vuex): Centralized State Management for Vue.js
- [Axios](https://github.com/axios/axios): Promise based HTTP client for the browser and node.js
- [Vuetify](https://vuetifyjs.com/en/): Material Design Component Framework.
  - [Validaciones formulario](https://vuetifyjs.com/en/components/forms)
  - [pre-defined-layouts](https://vuetifyjs.com/en/layout/pre-defined)
  - [vuetify-loader](https://github.com/vuetifyjs/vuetify-loader)
  - [Colores](https://vuetifyjs.com/en/style/colors)
  - [Iconos](https://material.io/tools/icons) [More Icons](https://materialdesignicons.com/) "material-design-icons-iconfont": "^5.0.1",

### Tecnologías para testing

- [vue-test-utils](https://vue-test-utils.vuejs.org)
- [jestjs](https://jestjs.io)
- [vue-test-utils-jest-example](https://github.com/vuejs/vue-test-utils-jest-example)
- AVA ??

- [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell): Para test end to end, lo estoy probando.
  Nota: En ubuntu tube que install `sudo apt-get install libgconf-2-4`

## Herramientas

### Recomendada

- [Text editor plugins](https://github.com/vuejs/awesome-vue#source-code-editing): Instala el plugin para tu editor
- [Prettier](https://prettier.io/) Dar formato, un estilo de escribir código. (Opcional)

### Usadas por Vue Cli

- [ESlint](https://eslint.org/) The pluggable linting utility for JavaScript and JSX
- [Babel](https://babeljs.io/) Use next generation JavaScript, today. And more.

## Utilidades

- [Awesome-vue](https://github.com/vuejs/awesome-vue) Component and utilities
- [Vuescript.com](https://www.vuescript.com/) Components
- [Vuejsexamples](https://vuejsexamples.com/) Components
- [Ant-Design-vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce): CSS framework
- Validación de formulario
  - [Doc oficial form-validation](https://vuejs.org/v2/cookbook/form-validation.html)
  - ~~[Vuelidate](https://github.com/monterail/vuelidate)~~
  - [Vee-validate](https://github.com/baianat/vee-validate)
- [Date-fns](https://date-fns.org/docs/Getting-Started)
- [Imgan copmress](https://imageoptim.com/online)
- [Imge to base64](https://www.base64-image.de/)

## Como trabajaremos :D

### Generales

- **ECMAScript6**: Recomiendo leer un poco de [ES6](es6-features.org), ya que los componentes los escribimos que con la nueva version de JavaScript, y puede ser confuso si estas acostumbrado a la forma clásica, también podes escribir de forma clásica.
- **Escritura de componentes**, Para tener una guia y coherencia en la forma de armar el proyecto usaremos [Vue style guide](https://vuejs.org/v2/style-guide)
- **[CircleCI](https://circleci.com)**: No es importante, usamos al version free, me gusta porque corre los test cada vez que alguien sube algo al repo, tenemos 1000 min (Subir de a varios commit)
- **Changelog** En caso de querer tener un changelog recomiendo que usemos etiquetas en los commit importantes, `new: [msj]`, `change: [msj]`, `fix: [msj]`, `note: [msj]`, para mostrar en la lista de cambios.

### Desarrollo

#### Solo una vez, la primera vez

1. Clonar el repo, `git clone git@bitbucket.org:qutap/rapicopia-client.git`

> **nota** Recomiendo usar ssh, también tiene que configurarse en la cuenta de bitbucket.

2. Instalar las dependencias, librerías que usaremos en el proyecto `npm install`

#### Compiles and hot-reloads for development

Antes de comenzar a editar archivos correr `npm start`, de esta manera cada
vez que cambies el código y guardes, se refresca la web con los nuevos cambios.

> **nota** Existen cambios muy puntuales que se necesita volver a correr este
> comando para ver su efecto

#### Compiles and minifies for production

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

Cuando queremos tener la app lista para producción `npm run build -- ./config/demo`,
crea todo lo necesario en la carpeta dist

### Run your tests

- Remotamente se corren automáticamente desde CircleCI

- Localmente `yarn run test` corre `yarn run test:unit` y `yarn run test:e2e`.
  > **nota** Los tes hay que escribirlos, estaría bueno hacer los unit y correr el comando yarn run test:unit

### Lints and fixes files

El comando `npm run lint`, Evalúa el código en buscar de errores.

## Git ramas

Antes de trabajar

```bash
git checkout -b mm/feature develop
```

Varios commit ....

Unir cambios en rama Dev

```bash
git checkout develop
git merge --no-ff mm/feature
git delete -d mm/feature
git push origin develop
```

## Crear Tag y Changelog en Git

#### Especificación para version

> **Nota**: la version tiene que ser acorde al `package.json`

`vX.Y.Z` con:

- X: Version mayor.
- Y: Nueva funcionalidad.
- Z: Arreglos menores.

### Changelog

Para crear un change log.

```shell
  git changelog -t vX.Y.Z
```

### Git Tag

Cuando tenemos todos los cambios en nuestra rama master.

```shell
  git tag -a vX.Y.Z -m"mensaje"
```

## Notas.

### Git

I don’t care if there is any other conflict. My branch A will win. Always

```shell
    git checkout A
    git merge -s ours master
    git checkout master
    git merge A
```

It is just the File B which should win. All others should be merged as normal

```shell
    git checkout A
    cp B ../outsideRepository
    git checkout master
    git merge --no-commit --no-ff A
    cp ../outsideRepsitory/B ./
    # Resolve other conflicts...
    git commit -m "Your merge message :-)"
```

Master branch? A is the new master.

```shell
  git checkout A
  git branch -D master #It forces to delete the master branch
  git branch master #Creates a new master on current head
  git checkout master
  git push origin master --force
```
