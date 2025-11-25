import "preact/debug";
import "preact/devtools";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { Game } from "../islands/Game.tsx";

export default define.page(function Home(_ctx) {
  return (
    <>
      <Head>
        <title>Chisanbop</title>
      </Head>
      <Game />
    </>
  );
});
