import { describe, expect, it } from 'vitest';
import { PASSWORD_RULES } from '@/constants/passwordRules';

function failedRuleIds(password) {
  return PASSWORD_RULES.filter((rule) => !rule.pattern.test(password)).map((rule) => rule.id);
}

describe('PASSWORD_RULES', () => {
  it('passes a password that meets every rule', () => {
    expect(failedRuleIds('Str0ng!Pass')).toEqual([]);
  });

  it.each([
    ['Sh0rt!', ['length']],
    ['lower0nly!', ['uppercase']],
    ['UPPER0NLY!', ['lowercase']],
    ['NoDigits!!', ['digit']],
    ['NoSpecial00', ['special']],
    ['abc', ['length', 'uppercase', 'digit', 'special']],
  ])('reports exactly which rules "%s" fails', (password, expected) => {
    expect(failedRuleIds(password)).toEqual(expected);
  });
});
