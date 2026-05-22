import * as contentService from "../services/content.service.js";

export function getHomepage(_req, res) {
  res.json(contentService.getHomepageContent());
}

export function updateHomepage(req, res) {
  const current = contentService.getHomepageContent();
  const updated = contentService.saveHomepageContent({
    ...current,
    ...req.body,
    featureCards: {
      ...current.featureCards,
      ...req.body.featureCards,
    },
    ourEssence: req.body.ourEssence ?? current.ourEssence,
  });
  res.json(updated);
}
