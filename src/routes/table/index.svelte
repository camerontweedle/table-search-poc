<script context="module" lang="ts">
	export function preload() {
		return this.fetch(`table/initial.json`).then((r: { json: () => any; }) => r.json()).then((records: { name: string; email: string, address: string, address2: string, phone: string, amount: number, date: string, notes: string }[]) => {
			return { records };
		});
	}
</script>

<script lang="ts">
  import { onMount } from "svelte";

	export let records: { name: string; email: string; address: string; address2: string; phone: string; amount: number; date: string; notes: string }[];

  onMount(() => {
    getNewRecords(1);
  });

  const getNewRecords = (page) => {
    return fetch(`table/lazy/${page}.json`).then((r: { json: () => any; }) => r.json()).then(response => {
      if (response.data) {
        records = records.concat(response.data);
      }

      if (response.next) {
        getNewRecords(response.next);
      }
    });
  }

  $: filterPage = (page: number) => {
    const start = (page - 1) * 20;
    const end = start + 20;
    return filteredRecords.slice(start, end);
  };

  $: filterRecords = () => {
    return records.filter(r => {
      return Object.values(r).filter(v => (v + '').toLowerCase().includes(search.toLowerCase())).length > 0;
    })
  }

  let page = 1;
  let search = '';
  $: maxPages = Math.ceil(filteredRecords.length / 20);
  $: visibleRecords = filterPage(page);
  $: filteredRecords = filterRecords();
</script>

<svelte:head>
	<title>Table - POC</title>
</svelte:head>

<h1>Table Search POC</h1>

<label>
  Search:
  <input type="text" placeholder="Search" bind:value={search} on:input={() => filterRecords()} />
  <button on:click={() => search = ''}>clear</button>
</label>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Address</th>
      <th>Phone</th>
      <th>Amount</th>
      <th>Date</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    {#each visibleRecords as record}
    <tr>
      <td class="nowrap">{record.name}</td>
      <td class="nowrap">{record.email}</td>
      <td class="nowrap">
        {record.address}<br />
        {record.address2}
      </td>
      <td class="nowrap">{record.phone}</td>
      <td class="nowrap">{record.amount}</td>
      <td class="nowrap">{record.date}</td>
      <td>{record.notes}</td>
    </tr>
    {/each}
  </tbody>
</table>

<button disabled={page === 1} on:click={() => page = 1}>First</button>
<button disabled={page === 1} on:click={() => page -= 1}>Prev</button>
<span>{page} of {maxPages}</span>
<button disabled={page === maxPages} on:click={() => page += 1}>Next</button>
<button disabled={page === maxPages} on:click={() => page = maxPages}>Last</button>

<style>
  .nowrap {
    white-space: nowrap;
  }
</style>
