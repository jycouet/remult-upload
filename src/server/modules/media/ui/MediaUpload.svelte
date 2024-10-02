<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Media } from "../";
  import { repo } from "remult";

  let loading = false;

  const dispatch = createEventDispatcher();

  const handleUpload = async (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    if (!target.files) {
      return;
    }
    if (target.files.length === 0) {
      return;
    }
    loading = true;
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64String = e.target?.result as string;
      try {
        await repo(Media).insert({
          base64: base64String,
          fileName: file.name,
          fileType: file.type,
          fileLastModified: new Date(file.lastModified),
        });
        dispatch("uploaded", { fileName: file.name });
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Could not upload file.");
      } finally {
        loading = false;
      }
    };
    reader.readAsDataURL(file);
  };
</script>

{#if loading}
  <div class="flex items-center space-x-4">
    <span> Chargement du fichier... en cours... </span>
  </div>
{:else}
  <input type="file" id="file-input" on:change={handleUpload} class="input" />
{/if}
