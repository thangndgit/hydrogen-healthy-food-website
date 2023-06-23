import {useLoaderData} from '@remix-run/react';
import {MediaFile} from '@shopify/hydrogen-react';
import {json} from '@shopify/remix-oxygen';
import {useState} from 'react';
import ProductOptions from '~/components/ProductOptions';
import {BiMinusCircle, BiPlusCircle} from 'react-icons/bi';
import {fieldsToObject} from '~/utils/converters';
import DishGrid from '~/components/DishGrid';

export async function loader({params, context, request}) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions = [];

  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
    },
  });

  if (!product?.id) throw new Response(null, {status: 404});

  const selectedVariant =
    product.selectedVariant ?? product?.variants?.nodes[0];

  const storeDomain = context.storefront.getShopifyDomain();

  return json({product, selectedVariant, storeDomain});
}

export default function DishtHandle() {
  const {product, selectedVariant} = useLoaderData();
  const [productCount, setProductCount] = useState(1);

  const orderable = selectedVariant?.availableForSale || false;
  const nutrients = fieldsToObject(product?.metafields);
  const relatedProducts =
    product?.collections?.edges?.[0]?.node?.products?.edges;
  const collectionHandle = product?.collections?.edges?.[0]?.node?.handle;

  const increaseCount = () => {
    setProductCount(productCount + 1);
  };
  const decreaseCount = () => {
    if (productCount === 1) return;
    setProductCount(productCount - 1);
  };

  return (
    <>
      <section className="w-[92vw] mx-auto mt-8 text-green-700 md:gap-8 grid">
        <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-hidden md:grid-cols-2 md:w-full lg:col-span-2">
            <div className="md:col-span-2 snap-center card-image aspect-square md:w-full w-[80vw] shadow rounded">
              <ProductGallery media={product.media.nodes} />
            </div>
          </div>
          <div className="md:sticky md:mx-auto max-w-xl md:max-w-[24rem] grid gap-8 p-0 md:p-6 md:px-0 top-[6rem]">
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold leading-10 whitespace-normal">
                {product.title}
              </h1>
              <span className="max-w-prose whitespace-pre-wrap inherit text-copy opacity-50 font-medium">
                100g thức ăn chứa {Number(nutrients.protein)}g đạm,{' '}
                {Number(nutrients.fat)}g chất béo, {Number(nutrients.carb)}g
                carbonhydrat và {Number(nutrients.kcal)} calories
              </span>
            </div>
            <ProductOptions
              options={product.options}
              selectedVariant={selectedVariant}
            />
            <div className="grid gap-2">
              <div className="whitespace-pre-wrap max-w-prose font-bold text-lead">
                Số lượng
              </div>
              <div className="flex gap-4 mb-4">
                <button onClick={decreaseCount}>
                  <BiMinusCircle size="1.25rem" />
                </button>
                <span>{productCount}</span>
                <button onClick={increaseCount}>
                  <BiPlusCircle size="1.25rem" />
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-xl font-semibold mb-2">
                {(
                  Number(selectedVariant.price.amount) * productCount
                ).toLocaleString('en-US')}{' '}
                VNĐ
              </div>
              {selectedVariant.compareAtPrice?.amount >
                selectedVariant.price?.amount && (
                <div className="text-xl font-semibold mb-2 line-through opacity-50">
                  {(
                    Number(selectedVariant.compareAtPrice.amount) * productCount
                  ).toLocaleString('en-US')}{' '}
                  VNĐ
                </div>
              )}
            </div>
            {orderable && (
              <div className="flex gap-4">
                <button className="btn btn-outline-primary basis-0 grow">
                  Thêm vào giỏ
                </button>
                <button className="btn btn-primary basis-0 grow">
                  Mua ngay
                </button>
              </div>
            )}
            {!orderable && <div>Sản phẩm hiện không có sẵn</div>}
            <div
              className="prose border-t border-gray-200 pt-6 text-black text-md"
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            ></div>
          </div>
        </div>
      </section>
      {relatedProducts && (
        <section className="w-[92vw] mx-auto mt-12 text-green-700 md:gap-8 grid">
          <h1 className="font-bold text-xl md:text-2xl">Món ăn liên quan</h1>
          <DishGrid
            products={relatedProducts}
            path={`/categories/${collectionHandle}`}
          />
        </section>
      )}
    </>
  );
}

function ProductGallery({media}) {
  if (!media.length) return null;

  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };

  return (
    <div
      className={`grid gap-4 overflow-x-scroll grid-flow-col md:grid-flow-row md:p-0 md:overflow-x-auto md:grid-cols-2 w-[90vw] md:w-full lg:col-span-2 slider`}
    >
      {media.map((med, i) => {
        let extraProps = {};

        if (med.mediaContentType === 'MODEL_3D') {
          extraProps = {
            interactionPromptThreshold: '0',
            ar: true,
            loading: 'eager',
            disableZoom: true,
            style: {height: '100%', margin: '0 auto'},
          };
        }

        const data = {
          ...med,
          __typename: typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
          image: {
            ...med.image,
            altText: med.alt || 'Product image',
          },
        };

        return (
          <div
            className={`${
              i % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'
            } snap-center card-image bg-white aspect-square md:w-full w-[80vw] shadow-sm rounded slider-item`}
            key={data.id || data.image.id}
          >
            <MediaFile
              tabIndex="0"
              className={`w-full h-full aspect-square object-cover rounded-2xl`}
              data={data}
              {...extraProps}
            />
          </div>
        );
      })}
    </div>
  );
}

const PRODUCT_QUERY = `#graphql
  query product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      collections(first: 1) {
        edges {
          node {
            id
            handle
            products(first: 4) {
              edges {
                node {
                  id
                  title
                  handle
                  totalInventory
                  featuredImage {
                    url
                  }
                  priceRange {
                    minVariantPrice {
                      amount
                    }
                    maxVariantPrice {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
      media(first: 10) {
        nodes {
          ... on MediaImage {
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
          ... on Model3d {
            id
            mediaContentType
            sources {
              mimeType
              url
            }
          }
        }
      }
      options {
        name,
        values
      }
      metafields(identifiers:[
        {
          namespace:"custom"
          key:"protein"
        },
        {
          namespace:"custom"
          key:"fat"
        },
        {
          namespace:"custom"
          key:"carb"
        },
        {
          namespace:"custom"
          key:"kcal"
        }
      ]) {
        value
        key
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
