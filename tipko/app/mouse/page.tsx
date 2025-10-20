import ClickSheeps from './minigames/ClickSheeps';
import DragSheeps from './minigames/DragSheeps';
import MouseTutorial from './tutorial/MouseTutorial';

export default function MousePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Vadba miške</h1>
      <MouseTutorial />
      <section>
        <h2>Klikni vse zvezdice</h2>
        <ClickSheeps />
      </section>
      {/* <section style={{ marginTop: "2rem" }}>
        <h2>Povleci prave predmete v škatlo</h2>
        <DragSheeps />
      </section> */}
    </main>
  );
}