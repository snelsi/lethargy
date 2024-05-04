import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { Snippet } from "@geist-ui/core";
import ScrollListener from "./ScrollListener";
import Footer from "./Footer";

const App = () => (
  <GeistProvider>
    <CssBaseline />
    <main>
      <h1>⭐️ Lethargy-TS Demo</h1>
      <p>
        Use your mouse wheel or a notebook trackpad to scroll the page! Lethargy-ts will distinguish
        between intentional wheel events and inertial scrolling. 😎
      </p>

      <Snippet text="pnpm i lethargy-ts" />

      <Snippet text="npm i --save lethargy-ts" />

      <Snippet text="yarn add lethargy-ts" />

      <ScrollListener />

      <Footer />
    </main>
  </GeistProvider>
);

export default App;
