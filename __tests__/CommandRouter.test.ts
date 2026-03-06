import CommandRouter from '../src/services/CommandRouter';
import {Command} from '../src/types/commands';

describe('CommandRouter', () => {
  let router: CommandRouter;

  beforeEach(() => {
    router = CommandRouter.getInstance();
  });

  describe('Command Validation', () => {
    it('should reject commands not in the allowlist', () => {
      const invalidCommand = {
        type: 'deleteAllData' as any,
        payload: {},
      };

      const result = router.validate(invalidCommand);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('not in the allowlist');
    });

    it('should validate navigate command with valid screen', () => {
      const validCommand: Command = {
        type: 'navigate',
        payload: {screen: 'Home'},
      };

      const result = router.validate(validCommand);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject navigate command with invalid screen', () => {
      const invalidCommand = {
        type: 'navigate',
        payload: {screen: 'InvalidScreen'},
      } as any;

      const result = router.validate(invalidCommand);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid screen');
    });

    it('should validate applyExploreFilter command with valid payload', () => {
      const validCommand: Command = {
        type: 'applyExploreFilter',
        payload: {filter: 'technology', sort: 'asc'},
      };

      const result = router.validate(validCommand);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject applyExploreFilter command with missing filter', () => {
      const invalidCommand = {
        type: 'applyExploreFilter',
        payload: {sort: 'asc'},
      } as any;

      const result = router.validate(invalidCommand);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Filter is required');
    });

    it('should reject applyExploreFilter command with invalid sort value', () => {
      const invalidCommand = {
        type: 'applyExploreFilter',
        payload: {filter: 'technology', sort: 'invalid'},
      } as any;

      const result = router.validate(invalidCommand);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Sort must be');
    });

    it('should validate setPreference command with valid payload', () => {
      const validCommand: Command = {
        type: 'setPreference',
        payload: {key: 'darkMode', value: true},
      };

      const result = router.validate(validCommand);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject setPreference command with invalid value type', () => {
      const invalidCommand = {
        type: 'setPreference',
        payload: {key: 'darkMode', value: {nested: 'object'}},
      } as any;

      const result = router.validate(invalidCommand);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be boolean, string, or number');
    });
  });

  describe('Confirmation Policy', () => {
    it('should require confirmation for setPreference command', () => {
      const command: Command = {
        type: 'setPreference',
        payload: {key: 'darkMode', value: true},
      };

      const requiresConfirm = router.requiresConfirmation(command);

      expect(requiresConfirm).toBe(true);
    });

    it('should require confirmation for applyExploreFilter command', () => {
      const command: Command = {
        type: 'applyExploreFilter',
        payload: {filter: 'technology'},
      };

      const requiresConfirm = router.requiresConfirmation(command);

      expect(requiresConfirm).toBe(true);
    });

    it('should NOT require confirmation for navigate command', () => {
      const command: Command = {
        type: 'navigate',
        payload: {screen: 'Home'},
      };

      const requiresConfirm = router.requiresConfirmation(command);

      expect(requiresConfirm).toBe(false);
    });

    it('should NOT require confirmation for openFlyout command', () => {
      const command: Command = {
        type: 'openFlyout',
        payload: {},
      };

      const requiresConfirm = router.requiresConfirmation(command);

      expect(requiresConfirm).toBe(false);
    });
  });
});
