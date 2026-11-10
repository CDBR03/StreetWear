# STREETWEAR

Vitrine de moda urbana responsiva, feita com HTML semântico, CSS em `site.css` e JavaScript moderno sem dependências externas de execução.

## Páginas

- `index.html`: campanha do drop, condições da loja, destaques, categorias, manifesto e lookbook.
- `loja.html`: catálogo de oito peças, filtros e ordenação por preço.
- `produto.html?item=camiseta-volume-01`: detalhe, tamanhos, informações de entrega e sugestões relacionadas.
- `lookbook.html`: editorial com modelos e looks.
- `sobre.html`: manifesto e valores da marca.

## Estrutura

```text
js/
  data/          catálogo declarativo de produtos
  models/        modelo Product e formatação de preço
  repositories/  acesso e consulta ao catálogo
  services/      carrinho e favoritos com persistência local
  ui/            componentes de produto e estrutura compartilhada
  pages/         controladores das páginas
  main.js        inicialização da aplicação
```

O projeto usa classes para representar produtos, catálogo, carrinho, favoritos e controladores de interface. Cada página é independente; os dados e componentes compartilhados vivem em módulos ES. Conteúdo dinâmico dos produtos é montado com APIs do DOM.

## Como abrir

Como o JavaScript usa módulos ES, sirva a pasta `outputs` em um servidor local e abra o endereço fornecido. No VS Code, a extensão Live Server funciona bem. Sem extensões, rode `python -m http.server 8000` dentro da pasta `outputs` e abra `http://localhost:8000`.

Fotos e fontes são carregadas de serviços externos; é necessária conexão à internet para vê-las. O carrinho e os favoritos são demonstrações locais; não há checkout nem envio de newsletter.
