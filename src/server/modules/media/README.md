# remult module: media

## Install dependencies

```bash
npm i @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @aws-sdk/util-create-request @aws-sdk/util-format-url -D
```

## Usage

```ts
import { media } from "MODULES_FOLDER/media/server";

export const api = remult_SERVER({
  modules: [media],
});
```
