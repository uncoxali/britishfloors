import { gql } from 'graphql-request';

// Product queries
export const GET_PRODUCTS = gql`
  query GetProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            id
            name
            values
          }
          metafields(identifiers: [
            {namespace: "custom", key: "dimensions"},
            {namespace: "custom", key: "finish"},
            {namespace: "product", key: "specifications"},
            {namespace: "specifications", key: "features"}
          ]) {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 250) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        id
        name
        values
      }
      specifications: metafield(namespace: "custom", key: "product_specifications") {
        type
        value
        # If metafield is single metaobject reference
        reference {
          ... on Metaobject {
            id
            fields { key value }
          }
        }
        # If metafield is list of metaobject references
        references(first: 20) {
          nodes {
            ... on Metaobject {
              id
              fields { key value }
            }
          }
        }
      }
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
      metafields(identifiers: [
        {namespace: "custom", key: "dimensions"},
        {namespace: "custom", key: "finish"},
        {namespace: "product", key: "specifications"},
        {namespace: "specifications", key: "features"}
      ]) {
        namespace
        key
        value
        type
      }
    }
  }
`;

// Product with specifications via metaobject reference metafield
export const GET_PRODUCT_WITH_SPECIFICATIONS = gql`
  query ProductWithSpecifications($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      specifications: metafield(namespace: "custom", key: "product_specifications") {
        references(first: 10) {
          nodes {
            ... on Metaobject {
              id
              fields {
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;

// Collection queries
export const GET_COLLECTIONS = gql`
  query GetCollections($first: Int!) {
    collections(first: $first, query: "published_status:published") {
      edges {
        node {
          id
          title
          handle
          description
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = gql`
  query GetCollectionByHandle($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 250) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              id
              name
              values
            }
            metafields(identifiers: [
              {namespace: "custom", key: "dimensions"},
              {namespace: "custom", key: "finish"},
              {namespace: "product", key: "specifications"},
              {namespace: "specifications", key: "features"}
            ]) {
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
  }
`;

// Search query
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $first: Int!, $after: String) {
    products(query: $query, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            id
            name
            values
          }
          metafields(identifiers: [
            {namespace: "custom", key: "dimensions"},
            {namespace: "custom", key: "finish"},
            {namespace: "product", key: "specifications"},
            {namespace: "specifications", key: "features"}
          ]) {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

// Blog queries
export const GET_BLOGS = gql`
  query GetBlogs($first: Int!, $after: String) {
    blogs(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const GET_ARTICLES = gql`
  query GetArticles($first: Int!, $after: String) {
    articles(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          excerpt
          content
          contentHtml
          publishedAt
          image {
            id
            url
            altText
            width
            height
          }
          author {
            name
          }
          tags
        }
      }
    }
  }
`;

export const GET_BLOG_BY_HANDLE = gql`
  query GetBlogByHandle($handle: String!, $first: Int!, $after: String) {
    blog(handle: $handle) {
      id
      title
      handle
      description
      image {
        id
        url
        altText
        width
        height
      }
      articles(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            excerpt
            content
            contentHtml
            publishedAt
            image {
              id
              url
              altText
              width
              height
            }
            author {
              name
            }
            tags
          }
        }
      }
    }
  }
`;

export const GET_ARTICLE_BY_HANDLE = gql`
  query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        title
        handle
        excerpt
        content
        contentHtml
        publishedAt
        image {
          id
          url
          altText
          width
          height
        }
        author {
          name
        }
        tags
      }
    }
  }
`;

// Get similar products by collection
export const GET_SIMILAR_PRODUCTS = gql`
  query GetSimilarProducts($collectionHandle: String!, $first: Int!, $excludeId: ID!) {
    collection(handle: $collectionHandle) {
      products(first: $first, query: "published_status:published") {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 250) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              id
              name
              values
            }
            metafields(identifiers: [
              {namespace: "custom", key: "dimensions"},
              {namespace: "custom", key: "finish"},
              {namespace: "product", key: "specifications"},
              {namespace: "specifications", key: "features"}
            ]) {
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
  }
`;

// Get products by tags for similar products
export const GET_PRODUCTS_BY_TAG = gql`
  query GetProductsByTag($query: String!, $first: Int!) {
    products(query: $query, first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            id
            name
            values
          }
          metafields(identifiers: [
            {namespace: "custom", key: "material"},
            {namespace: "custom", key: "dimensions"},
            {namespace: "custom", key: "weight"},
            {namespace: "custom", key: "finish"},
            {namespace: "product", key: "specifications"},
            {namespace: "specifications", key: "features"}
          ]) {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;