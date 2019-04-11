const serverUrl = 'http://localhost:3000'
var app = new Vue({
    el: '#app',
    created() {
        if(localStorage.token) {
            this.isLogin = false 
            this.getUserFavorites()   
        }    
    },
    data: {
        isLogin: true,
        email: "",
        password: "",
        jokeBanner: "",
        userFavorites: [],
    },
    methods: {
        login() {
            axios
                .post(serverUrl + '/login', {
                    email: this.email,
                    password: this.password
                })
                .then(({ data }) => {
                    localStorage.setItem('token', data.token)
                    swal("Successfully Logged In", "Welcome to this website", "success")
                    
                    this.generateNewJoke()
                    this.getUserFavorites()
                    this.isLogin=false
                })
                .catch(err => {
                    swal("Oh no!", "Bet you input a wrong credentials!", "warning");
                })
        },
        logout() {
            this.isLogin = true
            this.generateNewJoke()
            localStorage.clear()
            swal("Logged out successfully", "See you again soon!", "success");
        },
        generateNewJoke() {
            axios
                .get("https://icanhazdadjoke.com/", {headers: {Accept: "application/json"}})
                .then(({data}) => {
                    // console.log(data)
                    // //joke get
                    //Object { id: "ei3T08EQZob", joke: "Hostess: Do you have a preference of where you sit?\r\nDad: Down.", status: 200 }
                    this.jokeBanner = data.joke
                })
                .catch(err => {
                    swal("Success", "Success generate new Joke, just kidding! please try again", "success");
                })
        },
        addToFavorites() {
            if(this.jokeBanner === "") {
                swal("Oops", "...please the jokes is on their way :D, please generate jokes");
            } else {
                axios
                .post(serverUrl+'/favorites', {
                   joke:this.jokeBanner
                }, {headers:{token:localStorage.token}})
                .then(({data}) => {
                    this.getUserFavorites()
                    this.generateNewJoke()
                    swal("Whoosh!", "Succes adding new jokes to My Favorites", "success");
                })
                .catch(err => {
                    this.logout()
                })
            }
        },
        getUserFavorites() {
            axios
             .get(serverUrl+'/favorites', {headers:{token:localStorage.token}})
             .then(({data}) => {
                 this.userFavorites = data
             })
             .catch(err => {
                 //console.log('eror fetching user favorites - client')
                 this.logout()
             })
        },
        removeJoke(id) {
            // console.log(id)
            axios
                .delete(serverUrl+'/favorites/' + id, {headers:{token:localStorage.token}})
                .then(({data}) => {
                    //console.log(data)
                    //add swal
                    this.getUserFavorites()
                    swal("Notification", "Deleted the joke from My Favorite", "info");
                })
                .catch(err => {
                    //console.log(err)
                    this.logout()
                })
        }
    }
})