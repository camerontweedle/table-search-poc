import casual from "casual";

const content = (page) => {
  let data = []

  if(!getNext(page)) {
    return data
  }

  for (let i = 0; i < 1000; i++) {
    data.push({
      name: casual.full_name,
      email: casual.email,
      address: casual.address,
      address2: `${casual.city}, ${casual.state_abbr}, ${casual.country} ${casual.zip()}`,
      phone: casual.phone,
      amount: casual.integer(1000, 100000).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      date: casual.date('YYYY-MM-DD'),
      notes: casual.sentences(1),
    })
  }

  return data
}

const getNext = (page) => {
  return page < 200 ? parseInt(page) + 1 : false
}

export function get(req, res) {
  const { slug } = req.params;

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

  res.end(JSON.stringify({page: slug, next: getNext(slug), data: content(slug)}));
}
