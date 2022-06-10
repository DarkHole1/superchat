<script>
  import { afterUpdate } from "svelte";
  import io from "socket.io-client";

  const COLORS = [
    "blue",
    "mint",
    "green",
    "yellow",
    "peach",
    "orange",
    "red",
    "purple",
    "violet",
  ];

  let myColor = COLORS[0];
  let messages = [];
  let container = null;

  function autoresize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  const int = (n) => Math.floor(n * Math.random());
  const choice = (arr) => arr[int(arr.length)];
  const choices = (arr, n) =>
    n > 0 ? [choice(arr)].concat(choices(arr, n - 1)) : [];

  let _globalid = 1337;
  function addRandomMessage() {
    const length = int(50);
    const text = choices(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,0123456789                    ",
      length
    ).join("");
    const color = choice(COLORS);
    const id = _globalid++;
    messages.push({ id, text, color });
    messages = messages;
  }

  function randomType() {
    const msg = choice(messages.slice(-3));
    msg.text += choice(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,0123456789                    "
    );
    messages = messages;
  }

  // setInterval(addRandomMessage, 3 * 1000);
  // setInterval(randomType, 100);

  afterUpdate(() => {
    container.scrollTo(0, container.scrollHeight);
  });

  const URL = import.meta.env.DEV ? 'http://localhost:3030/' : '/'
  const socket = io(URL);
  socket.on("hello", (opts) => {
    myColor = opts.color;
  });
  socket.on('typing', (msg) => {
    let found = false;
    for (const omsg of messages) {
      if(msg.id == omsg.id) {
        omsg.text = msg.text;
        found = true;
        break;
      }
    }
    if(!found) {
      messages.push(msg)
    }
    messages = messages;
  })

  function change(e) {
    socket.emit('change', e.target.value);
    if(e.target.value.endsWith('\n')) {
      e.target.value = '';
    }
  }
</script>

<div class="container" bind:this={container}>
  {#each messages as message}
    <div class="message {message.color}">{message.text}</div>
  {/each}
  <textarea
    class={myColor}
    placeholder="Type anything..."
    on:input={autoresize}
    on:input={change}
  />
</div>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  :global(body) {
    height: 100vh;
    overflow: hidden;
    margin: 0;
  }

  :global(#app) {
    height: 100%;
  }

  .container,
  textarea {
    font-size: xx-large;
    font-weight: 200;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .container {
    max-width: 75%;
    /* padding: 1em; */
    margin: 0 auto;
    /* display: flex; */
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    /* overflow: hidden; */
    overflow-y: scroll;
    overflow-x: hidden;
  }

  textarea {
    border: 0;
    padding: 0;
    outline: none;
    width: 100%;
    overflow: hidden;
    resize: none;
  }

  .gap {
    height: 1em;
  }

  .blue {
    color: #1771f1;
  }

  .mint {
    color: #76fec5;
  }

  .green {
    color: #41b619;
  }

  .yellow {
    color: #ffe55e;
  }

  .peach {
    color: #fbceb5;
  }

  .orange {
    color: #ff7a2f;
  }

  .red {
    color: #e20338;
  }

  .purple {
    color: #ca1a8e;
  }

  .violet {
    color: #6e36ca;
  }

  :global(body.darkmode) {
    background-color: #2F3538;
  }
</style>
