const eventsList = document.querySelector("#events-list");
const eventCount = document.querySelector("#event-count");
const statusMessage = document.querySelector("#status");

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function createEventItem(event) {
  const item = document.createElement("li");
  const repository = event.repository;
  const link = document.createElement("a");
  const fullName = document.createElement("span");
  const date = document.createElement("time");
  const description = document.createElement("p");

  item.className = "event-item";
  link.className = "repo-link";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.name;

  fullName.className = "repo-full-name";
  fullName.textContent = repository.full_name;
  link.append(fullName);

  date.className = "event-date";
  date.dateTime = event.created_at;
  date.textContent = formatDate(event.created_at);

  description.className = "repo-description";
  description.textContent = repository.description;

  item.append(link, date, description);

  if (repository.language) {
    const language = document.createElement("span");
    language.className = "repo-language";
    language.textContent = repository.language;
    item.append(language);
  }

  return item;
}

async function loadEvents() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];

    eventsList.replaceChildren(...events.map(createEventItem));
    eventCount.textContent = String(events.length);
    statusMessage.textContent = events.length ? "" : "No starred repositories yet.";
  } catch (error) {
    statusMessage.dataset.state = "error";
    statusMessage.textContent = "Couldn't load the repository list. Run this page from a local web server and try again.";
    console.error("Unable to load starred repositories:", error);
  }
}

loadEvents();