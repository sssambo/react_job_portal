🎯 **What:** Extracted the magic number `2 * 1024 * 1024` into a constant `MAX_FILE_SIZE` in `frontend/src/components/Application/Application.jsx`.

💡 **Why:** This improves the maintainability and readability of the code by giving the limit context (`MAX_FILE_SIZE`). If we ever need to update the file size limit or use it in multiple places within this component in the future, we only need to update the constant.

✅ **Verification:** Verified by checking the diff, running `pnpm lint` and `pnpm build` in the `frontend` directory. The build completed without regressions and there were no new lint errors. Since there are no test scripts in the `package.json`, running the build was sufficient verification. The frontend codebase is running React 18, so some pre-existing 'React' is defined but never used errors exist but are unrelated.

✨ **Result:** The code health of `Application.jsx` is improved without altering the behavior of the application.
