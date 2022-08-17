document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {

      init() {
        axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
          .then((result) => {
            this.pizzas = result.data.pizzas
          })
          .then(() => {
            return this.createCart();
          })
          .then((result) => {
            this.cartId = result.data.cart_code;
          });
      },
      featuredPizzas() {
        return axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
      },
      postfeaturedPizzas() {
        return axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
      },

      createCart() {
        return axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=')
      },

      showCart() {
        const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

        axios
          .get(url)
          .then((result) => {
            this.cart = result.data;
          });
      },

      pizzaImage(pizza) {
        return `./images/${pizza.size}.jpg`
      },

      pizzas: [],
      featuredpizzas: [],
      cartId: '',
      cart: { total: 0 },
      paymentMessage: '',
      payNow: false,
      paymentAmount: 0,

      add(pizza) {
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
          .then(() => {
            this.message = "Pizza added to the cart"
            this.showCart();
          })
          .then(() => {

            return this.featuredPizzas();

          })
          .then(() => {
            return this.postfeaturedPizzas();
          })
          .catch(err => alert(err));

      },
      remove(pizza) {
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
          .then(() => {
            this.message = "Pizza removed from the cart"
            this.showCart();
          })
          .catch(err => alert(err));

      },
      pay(pizza) {
        const params = {
          cart_code: this.cartId,
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
          .then(() => {
            if (!this.paymentAmount) {
              this.paymentMessage = 'No amount entered, please enter enough money.'
            }
            else if (this.paymentAmount >= this.cart.total) {
              this.paymentMessage = 'Payment Sucessful!'
              setTimeout(() => {
                this.cart.total = 0
                window.location.reload()
              }, 6000);

            } else if (this.paymentAmount < this.cart.total) {
              this.paymentMessage = 'Sorry - Enter Enough Money.'
            }

          })
          .catch(err => alert(err));

      }

    }
  });
})