import * as contentService from "../services/content.service.js";

export async function getHomepage(req, res, next) {
  try {
    const content = await contentService.getHomepageContent();
    res.json(content);
  } catch (err) {
    next(err);
  }
}

export async function updateHomepage(req, res, next) {
  try {
    const content = await contentService.saveHomepageContent(req.body);
    res.json(content);
  } catch (err) {
    next(err);
  }
}

export async function listVentures(req, res, next) {
  try {
    const list = await contentService.listVentureSlugs();
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function getVenture(req, res, next) {
  try {
    const content = await contentService.getVentureContent(req.params.slug);
    res.json(content);
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

export async function updateVenture(req, res, next) {
  try {
    const payload = req.body.data ?? req.body;
    const content = await contentService.saveVentureContent(
      req.params.slug,
      payload,
    );
    res.json(content);
  } catch (err) {
    if (err.status === 404 || err.status === 400) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

export async function getExpeditions(req, res, next) {
  try {
    const content = await contentService.getExpeditionsContent();
    res.json(content);
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

export async function updateExpeditions(req, res, next) {
  try {
    const payload = req.body.data ?? req.body;
    const content = await contentService.saveExpeditionsContent(payload);
    res.json(content);
  } catch (err) {
    if (err.status === 404 || err.status === 400) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

export async function getJournal(req, res, next) {
  try {
    const content = await contentService.getJournalContent();
    res.json(content);
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

export async function updateJournal(req, res, next) {
  try {
    const payload = req.body.data ?? req.body;
    const content = await contentService.saveJournalContent(payload);
    res.json(content);
  } catch (err) {
    if (err.status === 404 || err.status === 400) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

export async function getArchive(req, res, next) {
  try {
    const content = await contentService.getArchiveContent();
    res.json(content);
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

export async function updateArchive(req, res, next) {
  try {
    const payload = req.body.data ?? req.body;
    const content = await contentService.saveArchiveContent(payload);
    res.json(content);
  } catch (err) {
    if (err.status === 404 || err.status === 400) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}
