var vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    carrinhoAtivo: false,
    mensagemAlerta: "Item adicionado",
    alertaAtivo: false
  },
  computed: {
    carrinhoTotal: function() {
      var total = 0;
      if(this.carrinho.length) {
        this.carrinho.forEach(function(item) {
          total += item.preco;
        });
      }
      return total;
    }
  },
  methods: {
    fetchProdutos: function() {
      axios.get("../../api/produtos.json").then(function(response) {
        vm.produtos = response.data;
      });
    },
    fetchProduto: function(id) {
      axios.get("../../api/produtos/"+id+"/dados.json").then(function(response) {
        vm.produto = response.data;
      });
    },
    abrirModal: function(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    fecharModal: function() {
      if(event.currentTarget == event.target) {
        this.produto = false;
      }
    },
    clickForaCarrinho: function() {
      if(event.currentTarget == event.target) {
        this.carrinhoAtivo = false;
      }
    },
    adicionarItem: function() {
      this.produto.estoque--;
      var produto = {
        id: this.produto.id,
        nome: this.produto.nome,
        preco: this.produto.preco
      };
      this.carrinho.push(produto);
      this.alerta(produto.nome + " adicionado ao carrinho");
    },
    removerItem: function() {
      this.carrinho.splice(0, 1);
    },
    checarLocalStorage: function() {
      if(window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    compararEstoque: function() {
      var itens = this.carrinho.filter(function(item) {
        if(item.id === vm.produto.id) {
          return item;
        }
      });
      this.produto.estoque -= itens.length;
    },
    alerta: function(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(function() {
        vm.alertaAtivo = false;
      }, 1500);
    },
    router: function() {
      var hash = document.location.hash.replace("#", "");
      if(hash) {
        this.fetchProduto(hash);
      }
    }
  },
  filters: {
    numeroPreco:function(valor) {
      return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
  },
  watch: {
    produto: function() {
      document.title = this.produto.nome || "Techno";
      var hash = this.produto.id || "";
      history.pushState(null, null, "#" + hash);
      if(this.produto) {
        this.compararEstoque();
      }
    },
    carrinho: function() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    }
  },
  created: function() {
    this.fetchProdutos();
    this.checarLocalStorage();
    this.router();
  }
});