import {useFetcher, useMatches} from '@remix-run/react';
import {CartAction} from '~/constants/types';

export function AddToCartButton({
  children,
  lines,
  className = '',
  disabled,
  analytics,
  ...props
}) {
  const [root] = useMatches();
  const selectedLocale = root?.data?.selectedLocale;
  const fetcher = useFetcher();
  const fetcherIsNotIdle = fetcher.state !== 'idle';

  return (
    <fetcher.Form action="/cart" method="post" className="whitespace-nowrap">
      <input type="hidden" name="cartAction" value={CartAction.ADD_TO_CART} />
      <input type="hidden" name="countryCode" value={selectedLocale.country} />
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <input type="hidden" name="analytics" value={JSON.stringify(analytics)} />
      <button
        type="submit"
        className={`btn btn-outline-primary w-full ${className}`}
        disabled={disabled ?? fetcherIsNotIdle}
        {...props}
      >
        {children}
      </button>
    </fetcher.Form>
  );
}
