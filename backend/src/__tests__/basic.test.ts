describe('Basic Tests', () => {
  describe('Math Operations', () => {
    it('should add numbers correctly', () => {
      expect(2 + 2).toBe(4);
      expect(10 + 5).toBe(15);
      expect(-1 + 1).toBe(0);
    });

    it('should multiply numbers correctly', () => {
      expect(3 * 4).toBe(12);
      expect(0 * 100).toBe(0);
      expect(-2 * 3).toBe(-6);
    });

    it('should handle division', () => {
      expect(10 / 2).toBe(5);
      expect(9 / 3).toBe(3);
      expect(1 / 3).toBeCloseTo(0.333, 2);
    });
  });

  describe('String Operations', () => {
    it('should concatenate strings', () => {
      expect('Hello' + ' ' + 'World').toBe('Hello World');
      expect(`Task: ${'Complete project'}`).toBe('Task: Complete project');
    });

    it('should check string length', () => {
      expect('TaskShare'.length).toBe(9);
      expect(''.length).toBe(0);
    });

    it('should convert case', () => {
      expect('TaskShare'.toLowerCase()).toBe('taskshare');
      expect('taskshare'.toUpperCase()).toBe('TASKSHARE');
    });
  });

  describe('Array Operations', () => {
    it('should create and manipulate arrays', () => {
      const tasks = ['Task 1', 'Task 2', 'Task 3'];
      expect(tasks.length).toBe(3);
      expect(tasks[0]).toBe('Task 1');
      
      tasks.push('Task 4');
      expect(tasks.length).toBe(4);
    });

    it('should filter arrays', () => {
      const numbers = [1, 2, 3, 4, 5];
      const evenNumbers = numbers.filter(n => n % 2 === 0);
      expect(evenNumbers).toEqual([2, 4]);
    });

    it('should map arrays', () => {
      const tasks = ['task 1', 'task 2'];
      const upperTasks = tasks.map(task => task.toUpperCase());
      expect(upperTasks).toEqual(['TASK 1', 'TASK 2']);
    });
  });

  describe('Object Operations', () => {
    it('should create and access objects', () => {
      const user = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };

      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(Object.keys(user)).toEqual(['id', 'name', 'email']);
    });

    it('should handle object destructuring', () => {
      const task = {
        id: '1',
        title: 'Complete project',
        completed: false
      };

      const { title, completed } = task;
      expect(title).toBe('Complete project');
      expect(completed).toBe(false);
    });
  });

  describe('Date Operations', () => {
    it('should work with dates', () => {
      const now = new Date();
      expect(now).toBeInstanceOf(Date);
      expect(typeof now.getTime()).toBe('number');
    });

    it('should format dates', () => {
      const date = new Date(2024, 0, 1); // Year, Month (0-based), Day
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0); // January is 0
    });
  });
});
