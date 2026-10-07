import type { CodegenConfig } from "@graphql-codegen/cli";

// The GitHub schema comes from @octokit/graphql-schema, so codegen runs offline
// and in CI without a token. Bump that package to pick up schema changes.
const config: CodegenConfig = {
  schema: "node_modules/@octokit/graphql-schema/schema.graphql",
  documents: ["src/**/*.{ts,tsx}", "!src/gql/**"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        // Emit documents as typed strings: we send them with plain fetch, so
        // there is no need to ship a parsed AST (see ADR 2).
        documentMode: "string",
        enumsAsTypes: true,
        useTypeImports: true,
        skipTypename: true,
        scalars: {
          Base64String: "string",
          BigInt: "string",
          Date: "string",
          DateTime: "string",
          GitObjectID: "string",
          GitRefname: "string",
          GitSSHRemote: "string",
          GitTimestamp: "string",
          HTML: "string",
          PreciseDateTime: "string",
          URI: "string",
          X509Certificate: "string",
        },
      },
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
