TypeScript Verification:
------------------------

Procedure: Omitted one key (cause in component logic i use a commont status count and removing one key from it no effect)
            - const counts: StatusCounts = {} as Omit<StatusCounts, 'Delivered'>;

Error:  Property 'Delivered' is missing in type 'Omit<StatusCounts, "Delivered">' but required in type 'StatusCounts'.ts(2741) 


Build Verification:
-------------------

Procedure: Ensure npx tsc -b reports zero errors and npm run build succeeds.

Console Output: PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-web> npx tsc -b
PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-web> npm run build

> shiphub-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
✓ 26 modules transformed.
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-BR9bhuA1.css    1.34 kB │ gzip:  0.51 kB
dist/assets/index-CnaRIeDg.js   223.51 kB │ gzip: 69.93 kB

✓ built in 1.18s
PS D:\Wa\Plugin-hive-training\shiphub-capstone\shiphub-web> 