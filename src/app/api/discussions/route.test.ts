import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Hoist mocks
const mocks = vi.hoisted(() => {
  const mockWhere = vi.fn().mockReturnThis();
  const mockLeftJoin = vi.fn().mockReturnThis();
  const mockLimit = vi.fn().mockReturnThis();
  const mockOffset = vi.fn().mockReturnThis();
  const mockOrderBy = vi.fn().mockReturnThis();

  const mockFrom = vi.fn().mockReturnValue({
    leftJoin: mockLeftJoin,
    where: mockWhere,
    orderBy: mockOrderBy,
    limit: mockLimit,
    offset: mockOffset,
  });

  const mockSelect = vi.fn().mockReturnValue({
    from: mockFrom
  });

  return {
    mockWhere,
    mockLeftJoin,
    mockLimit,
    mockOffset,
    mockOrderBy,
    mockFrom,
    mockSelect
  };
});

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'test-user-id' }
      })
    }
  }
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers())
}));

vi.mock('@/db', () => ({
  db: {
    select: mocks.mockSelect
  }
}));

vi.mock('@/db/schema', () => ({
  discussions: {
    id: 'discussions.id',
    title: 'discussions.title',
    content: 'discussions.content',
    subject: 'discussions.subject',
    imageUrl: 'discussions.imageUrl',
    createdBy: 'discussions.createdBy',
    likes: 'discussions.likes',
    createdAt: 'discussions.createdAt',
    updatedAt: 'discussions.updatedAt',
  },
  discussionReplies: {
    discussionId: 'discussionReplies.discussionId'
  },
  user: {
    name: 'user.name',
    id: 'user.id'
  }
}));

// Import AFTER mocks
import { GET } from './route';

describe('GET /api/discussions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use correct SQL AND operator when multiple filters are applied', async () => {
    // Create request with both subject and search params
    const url = 'http://localhost/api/discussions?subject=Math&search=algebra';
    const req = new NextRequest(url);

    // Call the handler
    await GET(req);

    // Verify db.select was called
    expect(mocks.mockSelect).toHaveBeenCalled();
    expect(mocks.mockFrom).toHaveBeenCalled();

    // Verify .where() was called
    expect(mocks.mockWhere).toHaveBeenCalled();

    // Get the argument passed to .where()
    const whereArg = mocks.mockWhere.mock.calls[0][0];

    // Inspect the argument.
    // Drizzle's `sql` template literal returns an object.
    // If the bug is present, one of the values in that object will be the string "[object Object] AND [object Object]"

    // We can try to serialize it to see its content
    const json = JSON.stringify(whereArg);
    console.log('Where argument JSON:', json);

    // The bug creates a string "[object Object] AND [object Object]" which ends up in the query
    expect(json).not.toContain('[object Object]');
  });
});
