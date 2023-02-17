import Indicator, { states } from "./Indicator";
import ScrollListener from "./ScrollListener";
import About from "./About";

const App = () => (
  <main>
    <h1>Lethargy Demo</h1>
    <p>
      Each scroll <em>intent</em> should fire only one block of events, regardless of the device -
      mousewheel or trackpad. Start scrolling!
    </p>

    <div className="indicators">
      {states.map((state) => (
        <Indicator state={state} key={state} />
      ))}
    </div>

    <ScrollListener />

    <About />
  </main>
);

export default App;
