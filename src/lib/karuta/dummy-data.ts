import { faker } from '@faker-js/faker';
import type { NormalizedPrototype } from '@f88/promidas/types';

/**
 * Generate dummy NormalizedPrototype data for development
 */
export function generateDummyPrototypes(
  count: number = 5,
): NormalizedPrototype[] {
  const prototypes: NormalizedPrototype[] = [];
  const usedIds = new Set<number>();

  for (let i = 0; i < count; i++) {
    let id: number;
    do {
      id = faker.number.int({ min: 1, max: 100000 });
    } while (usedIds.has(id));
    usedIds.add(id);

    prototypes.push({
      id,
      prototypeNm: faker.commerce.productName(),
      summary: faker.commerce.productDescription(),
      freeComment: faker.lorem.paragraph(),
      systemDescription: faker.lorem.sentence(),
      mainUrl: faker.image.url(),
      users: [faker.person.fullName()],
      tags: faker.helpers.arrayElements(
        ['IoT', 'AI', 'Robot', 'Education', 'Healthcare', 'Entertainment'],
        { min: 1, max: 3 },
      ),
      materials: [],
      events: [],
      awards: [],
      teamNm: faker.company.name(),
      createDate: faker.date.past().toISOString(),
      updateDate: undefined,
      releaseDate: undefined,
      officialLink: undefined,
      videoUrl: undefined,
      relatedLink: undefined,
      relatedLink2: undefined,
      relatedLink3: undefined,
      relatedLink4: undefined,
      relatedLink5: undefined,
      viewCount: faker.number.int({ min: 0, max: 10000 }),
      goodCount: faker.number.int({ min: 0, max: 1000 }),
      commentCount: faker.number.int({ min: 0, max: 100 }),
      releaseFlg: 1,
      status: 1,
      createId: undefined,
      updateId: undefined,
      uuid: undefined,
      nid: undefined,
      revision: undefined,
      licenseType: undefined,
      thanksFlg: undefined,
      slideMode: undefined,
    });
  }

  return prototypes;
}
