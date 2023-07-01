import {Form} from '@remix-run/react';

export default function Account() {
  return (
    <Form method="post" action="/account/logout">
      <button type="submit" className="btn btn-primary">
        Đăng xuất
      </button>
    </Form>
  );
}
