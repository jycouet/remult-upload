<script lang="ts">
  import { MediaWithUrl, MediaUpload } from "$modules/media";
  import { repo } from "remult";

  import { browser } from "$app/environment";
  let list: MediaWithUrl[] = [];

  const refresh = async () => {
    list = await repo(MediaWithUrl).find({});
  };

  $: browser && refresh();
</script>

<h1>Welcome to remult-upload!</h1>

<!-- <ul>
  <li><a href="https://kit.svelte.dev/">SvelteKit</a>, <a href="https://remult.dev/docs/quickstart#connecting-a-database">JSON Files</a>, <a href="https://remult.dev">remult</a></li>
  <li>Admin: <a href="/api/admin">Admin</a></li>
  <li><Todo /></li>
</ul> -->

<MediaUpload on:uploaded={refresh} />

{#each list as media}
  <div>
    <pre>{JSON.stringify(media, null, 2)}</pre>
  </div>

  <img width="50" src={media.url} alt={media.fileName} />

  <button
    on:click={async () => {
      const ttt = await MediaWithUrl.getFromS3(media);
      console.log("url:", ttt.url);
    }}
  >
    Get URL
  </button>

  <button
    on:click={async () => {
      await repo(MediaWithUrl).delete(media);
      await refresh();
    }}
  >
    delete
  </button>
{/each}
