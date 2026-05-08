export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const { successorId } = req.query;

  if (!successorId) {
    return res.status(400).json({
      success: false,
      error: 'Successor ID is required',
    });
  }

  try {
    const successor = await getSuccessor(successorId);

    if (!successor) {
      return res.status(404).json({
        success: false,
        error: 'Successor not found',
      });
    }

    if (!successor.hasAcceptedTOS) {
      return res.status(403).json({
        success: false,
        locked: true,
        message: 'You must accept the Cairn Zero Terms of Service before accessing successor data.',
        tosUrl: '/terms-of-service',
        tosVersion: '2026-04-16',
      });
    }

    return res.status(200).json({
      success: true,
      locked: false,
      hasAcceptedTOS: true,
      tosAcceptedDate: successor.tosAcceptedDate,
    });
  } catch (error) {
    console.error('Access check error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to check access',
    });
  }
}

async function getSuccessor(successorId) {
  return {
    id: successorId,
    hasAcceptedTOS: false,
    tosAcceptedDate: null,
  };
}
