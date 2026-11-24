/**
 * BUG-016: own chat messages must map as outgoing.
 */
import { isOutgoingChatAuthor } from '../../src/lib/mappers';

describe('BUG-016: chat sender mapping', () => {
  it('BUG-016: string author user is outgoing', () => {
    expect(isOutgoingChatAuthor('user')).toBe(true);
    expect(isOutgoingChatAuthor('agent')).toBe(false);
  });

  it('BUG-016: object author with matching id is outgoing', () => {
    expect(isOutgoingChatAuthor({ kind: 'user', id: 'u1' }, 'u1')).toBe(true);
    expect(isOutgoingChatAuthor({ kind: 'user', id: 'u2' }, 'u1')).toBe(false);
  });

  it('BUG-016: buyer/seller role without a loaded user id is still outgoing', () => {
    expect(isOutgoingChatAuthor({ kind: 'buyer', sender_role: 'customer' })).toBe(true);
  });

  it('BUG-016 neighbouring: agent stays incoming', () => {
    expect(isOutgoingChatAuthor({ kind: 'agent', name: 'Support' }, 'u1')).toBe(false);
  });
});
