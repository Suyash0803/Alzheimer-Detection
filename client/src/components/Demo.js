import "./DemoStyles.css";
import DemoData from "./DemoData";
import Demo1 from "../assets/5.jpg";
import Demo2 from "../assets/8.jpg";
import Demo3 from "../assets/6.jpg";

function Demo() {
  return (
    <div className="Demo">
      <h1>How It Works?</h1>
      <p>Take this simple test to track your cognitive health</p>
      <div className="Democard">
        {/* <h2>Hi</h2> */}
        <DemoData
          image={Demo1}
          heading="1. Record"
          text="Capture your voice, tell your story. Every word holds a clue to your cognitive health."
        />
        <DemoData
          image={Demo2}
          heading="2. Detect"
          text="Our advanced algorithms decode the subtle nuances of your speech, unveiling potential indicators of cognitive health."
        />
        <DemoData
          image={Demo3}
          heading="3. Empower"
          text="With early detection, you can take proactive steps toward preserving cognitive function and living your best life." // cliche
        />
      </div>
    </div>
  );
}

export default Demo;

