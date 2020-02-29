
## @oresoftware/version-checker
> Checks to see if runtime library versions match expected versions.


#### Using Javascript:

```typescript
import tool from '@oresoftware/version-checker'
tool();

```

#### Using bash

```bash
$ ores_version_checker .
```

#### Using shell

```bash

node(){
 command node --require '@oresoftware/version-checker/tool' "$@"
}

export -f node;
```

or better yet

```bash

node(){

    if ! command -v node_version_checker; then
        (
          unsef -f node;
          npm i -f -g '@oresoftware/version-checker'
        )

    fi

    nvc_path="$(node_version_checker --path)"
    command node --require "$nvc_path" "$@"
}

export -f node;

```
