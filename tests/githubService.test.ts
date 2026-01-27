import { describe, it, expect } from 'vitest';
import { parseGithubUrl } from '../services/githubService';

describe('githubService', () => {
  it('should parse valid github urls', () => {
    expect(parseGithubUrl('https://github.com/owner/repo')).toEqual({ owner: 'owner', name: 'repo' });
    expect(parseGithubUrl('https://github.com/owner/repo/')).toEqual({ owner: 'owner', name: 'repo' });
  });

  it('should return null for invalid urls', () => {
    expect(parseGithubUrl('https://google.com')).toBeNull();
    expect(parseGithubUrl('')).toBeNull();
  });
});
