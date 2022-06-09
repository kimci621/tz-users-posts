Vue.createApp({
  data() {
    return {
      posts: [],
      inputStatus: {
        title: '',
        body: '',
        id: ''
      },
      email: { value: "" },
      password: { value: "" },
      loginPage: true,
      publicPage: false,
      authorizedPage: false,
      userFind: false,
      errorText: false,
      loader: false,
    }
  },
  methods: {
    //вернет массив с зарегистрированными пользователями
    async getAuth() {
      try {
        const res = await fetch(`http://localhost:3000/users`);
        return await res.json();
      } catch (e) {
        alert('Couldn\'t connect to server');
      }
    },
    //вернет массив с постами
    async getPosts() {
      try {
        const res = await fetch(`http://localhost:3000/posts`);
        return await res.json();
      } catch (e) {
        alert('Couldn\'t connect to server');
      }
    },
    //редактировать текст поста 
    async editPostPUT(id, title, body) {
      fetch(`http://localhost:3000/posts/${id}`, {
        method: "put",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        //make sure to serialize your JSON body
        body: JSON.stringify({
          id: id,
          title: title,
          body: body
        })
      })
    },
    //добавление в зарегистрированные 
    async registerPost(email, password) {
      fetch(`http://localhost:3000/users/`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        //make sure to serialize your JSON body
        body: JSON.stringify({
          email: `${email}`,
          password: `${password}`
        })
      })
    },
    //инициализация регистрации
    register() {
      this.registerPost(this.email.value, this.password.value)
    },
    openLoginPage() {
      this.loginPage = !this.loginPage;
      this.authorizedPage = false;
      this.publicPage = false;
      this.userFind = false;
    },
    editPostOpen(id) {
      document.querySelector(`#post-${id}`).classList.remove('hidden');
      this.inputStatus.id = `${id}`;
    },
    editPostClose(id) {
      document.querySelector(`#post-${id}`).classList.add('hidden');
      this.inputStatus.id = "";
    },
    sendNewPost() {
      this.loaderTrigger();
      if (this.inputStatus.title && this.inputStatus.body && this.inputStatus.id) {
        this.editPostPUT(this.inputStatus.id, this.inputStatus.title, this.inputStatus.body);
        this.getPosts().then(res => {
          this.posts = res.map(i => i);
        })
          .then((res) => {
          })
      }
      this.loaderTrigger();
    },
    login() {
      this.loaderTrigger();
      this.getAuth().then(res => {
        res.forEach(i => {
          if (i.email === `${this.email.value}`, i.password === `${this.password.value}`) {
            this.userFind = true;
            this.errorText = false;
            this.loaderTrigger();
            if (this.userFind) {
              this.authorizedPage = true;
              this.loginPage = false;
              this.publicPage = false;
            }
          } else {
            this.errorText = true;
            this.userFind = false;
            this.loaderTrigger();
          }
        })
      })
    },
    close() {
      if (this.userFind) {
        this.authorizedPage = true;
        this.loginPage = false;
        this.publicPage = false;
      } else {
        this.authorizedPage = false;
        this.loginPage = false;
        this.publicPage = true;
      }
    },
    loaderTrigger() {
      this.loader = !this.loader;
    }
  },
  created() {
    this.loaderTrigger();
    this.getPosts().then(res => {
      this.posts = res.map(i => i);
    })
  },
  mounted() {
    this.loaderTrigger();
  },
})
  .mount('#app');


